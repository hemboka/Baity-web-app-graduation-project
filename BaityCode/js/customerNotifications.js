
const token = localStorage.getItem("token");

async function fetchNotifications() {
  try {
    const res = await fetch("http://localhost:5000/api/orders/customer/", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    const container = document.getElementById("notificationsContainer");
    container.innerHTML = "";

    if (!data.orders || data.orders.length === 0) {
      container.innerHTML = "<div style='text-align:center; color:#777;'>لا توجد إشعارات حالياً</div>";
      return;
    }

    const grouped = {};
    data.orders.forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString("ar-EG");
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(order);
    });

    Object.keys(grouped).reverse().forEach(date => {
      const sectionTitle = document.createElement("div");
      sectionTitle.className = "section-title";
      sectionTitle.textContent = date === new Date().toLocaleDateString("ar-EG") ? "اليوم" : date;
      container.appendChild(sectionTitle);

      grouped[date].forEach(order => {
        const card = document.createElement("div");
        card.className = "notification-card";

        const chefName = order.chef?.name || "؟";
        const mealName = order.meal?.name || "؟";
        const temperature = order.meal?.temperature ? `. ${order.meal.temperature}` : "";
        const status = order.status;
        const paymentStatus = order.paymentStatus || "تحت المعالجة";

        card.innerHTML = `
          <div class="notification-header">
            <div class="notification-text">
              حالة الطلب: <strong>${status}</strong> - الشيف ${chefName}
            </div>
            <div class="notification-icon ${status === "مقبول" ? "success" : (status === "مرفوض" ? "error" : "")}">
              <span class="material-icons">
                ${status === "مقبول" ? "check" : status === "مرفوض" ? "close" : "hourglass_empty"}
              </span>
            </div>
          </div>
          <div class="notification-time">
            ${new Date(order.createdAt).toLocaleTimeString("ar-EG")} - 
            ${order.quantity || 1} × ${mealName} ${temperature} 
            <br>حالة الدفع: ${paymentStatus}
          </div>
          <div class="order-actions" id="order-${order._id}">
            ${status === "مقبول" && paymentStatus === "تحت المعالجة" ? `
              <button class="btn-pay" onclick="payOrder('${order._id}')">💳 دفع</button>
              <button class="btn-cancel" onclick="cancelOrder('${order._id}')">❌ إلغاء</button>
            ` : ""}
          </div>
        `;

        container.appendChild(card);
      });
    });
  } catch (err) {
    console.error("Error fetching notifications", err);
  }
}

async function payOrder(orderId) {
  alert(`هندمج لاحقًا عملية الدفع للطلب رقم ${orderId}`);
  // أو تروح لصفحة دفع لو هتربطها بـ payment gateway حقيقي
}

async function cancelOrder(orderId) {
  const confirmCancel = confirm("هل أنت متأكد أنك تريد إلغاء هذا الطلب؟");
  if (!confirmCancel) return;

  try {
    // 1. تحديث حالة الدفع إلى "تم الإلغاء"
    const res = await fetch(`http://localhost:5000/api/orders/payment/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ paymentStatus: "تم الإلغاء" }),
    });

    const result = await res.json();
    if (!res.ok) {
      alert("فشل في تحديث حالة الدفع: " + result.message);
      return;
    }

    // 2. حذف الطلب من قاعدة البيانات
    const deleteRes = await fetch(`http://localhost:5000/api/orders/customer/${orderId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    const deleteResult = await deleteRes.json();
    if (deleteRes.ok) {
      alert("تم إلغاء الطلب وحذفه بنجاح");
      fetchNotifications();
    } else {
      alert("فشل في حذف الطلب: " + deleteResult.message);
    }

  } catch (err) {
    alert("حدث خطأ أثناء إلغاء الطلب");
    console.error(err);
  }
}

fetchNotifications();
