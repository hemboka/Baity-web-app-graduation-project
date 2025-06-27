  const token = localStorage.getItem("token");

  async function fetchNotifications() {
  try {
    const res = await fetch("http://localhost:5000/api/orders/chef/", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    const container = document.getElementById("notificationsContainer");
    container.innerHTML = "";

    if (!data.orders || data.orders.length === 0) {
      container.innerHTML = "<div style='text-align:center; color:#777;'>لا توجد طلبات حالياً</div>";
      return;
    }

    const pendingOrders = data.orders
      .filter(order => order.status === "تحت المعالجة")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (pendingOrders.length === 0) {
      container.innerHTML = "<div style='text-align:center; color:#777;'>لا توجد طلبات جديدة حالياً</div>";
      return;
    }

    pendingOrders.forEach(order => {
      const card = document.createElement("div");
      card.className = "notification-card";

      const customerName = order.customer?.name || "عميل غير معروف";
      const mealName = order.meal?.name || "؟";
      const temperature = order.temperature ? `. ${order.temperature}` : "";

      card.innerHTML = `
        <div class="notification-header">
          <div class="notification-text">
            طلب جديد من <strong>${customerName}</strong>
          </div>
          <div class="notification-icon" style="background-color: #2196F3;">
            <span class="material-icons">notifications</span>
          </div>
        </div>
        <div class="notification-time">
          ${new Date(order.createdAt).toLocaleTimeString("ar-EG")} - 
          ${order.quantity || 1} × ${mealName} ${temperature}
        </div>
        <div style="margin-top: 10px; text-align: center;">
          <button onclick="updateOrder('${order._id}', 'مقبول')" style="background: #4CAF50; color: white; border: none; padding: 8px 14px; border-radius: 8px; margin-left: 10px;">قبول</button>
          <button onclick="updateOrder('${order._id}', 'مرفوض')" style="background: #f44336; color: white; border: none; padding: 8px 14px; border-radius: 8px;">رفض</button>
        </div>
      `;

      container.appendChild(card);
    });

  } catch (err) {
    console.error("❌ Error fetching notifications", err);
    document.getElementById("notificationsContainer").innerHTML = "<div style='color:red;text-align:center'>فشل في تحميل الإشعارات</div>";
  }
}

async function updateOrder(orderId, status) {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`http://localhost:5000/api/orders/status/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ تم تحديث حالة الطلب");
      fetchNotifications(); // إعادة تحميل الإشعارات
    } else {
      alert("❌ فشل في تحديث الحالة: " + data.message);
    }
  } catch (err) {
    console.error("❌ Error updating order", err);
    alert("حدث خطأ أثناء تحديث حالة الطلب");
  }
}

  fetchNotifications();