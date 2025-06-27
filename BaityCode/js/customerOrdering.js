
let mealId = localStorage.getItem("selectedMealId");

function updateCount(change) {
  const countEl = document.getElementById('meal-count');
  let count = parseInt(countEl.textContent);
  count = Math.max(1, count + change);
  countEl.textContent = count;
}

async function submitOrder() {
  const count = parseInt(document.getElementById('meal-count').textContent);
  const spicy = document.getElementById('spicy-hot').checked ? 'حار' : 'بارد';
  const deliveryServicePrice = 20;
  const location = "شارع التحرير، الجيزة";
  const governorate = "giza";

  const token = localStorage.getItem("token");
  if (!token) {
    alert("يجب تسجيل الدخول أولاً.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/orders/${mealId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        quantity: count,
        location,
        temperature: spicy,
        deliveryServicePrice,
        governorate
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "حدث خطأ أثناء تنفيذ الطلب");
    }

    document.getElementById("successModal").style.display = "flex";
  } catch (err) {
    alert("فشل في تنفيذ الطلب: " + err.message);
  }
}

function goToNotifications() {
  window.location.href = "/pages/customerNotification.html";
}
