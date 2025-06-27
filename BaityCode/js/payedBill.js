
    const governorateInput = document.getElementById("governorate");
    const addressInput = document.getElementById("address");
    const orderCostSpan = document.getElementById("orderCost");
    const deliveryFeeSpan = document.getElementById("deliveryFee");
    const totalCostSpan = document.getElementById("totalCost");
    const successPopup = document.getElementById("successPopup");

    const deliveryFee = 15;
    const currentOrder = JSON.parse(localStorage.getItem("currentOrder") || "{}");
    const mealId = localStorage.getItem("currentMealId");
    const quantity = parseInt(currentOrder.count || "1");
    const mealPrice = parseFloat(currentOrder.price?.replace(" L.E", "") || 0);

    const price = quantity * mealPrice;
    const total = price + deliveryFee;

    orderCostSpan.textContent = `${price} ج.م`;
    deliveryFeeSpan.textContent = `${deliveryFee} ج.م`;
    totalCostSpan.textContent = `${total} ج.م`;

    document.getElementById("submitOrder").addEventListener("click", async () => {
      const governorate = governorateInput.value;
      const address = addressInput.value.trim();

      if (!governorate || !address) {
        alert("يرجى إدخال المحافظة والعنوان بشكل صحيح.");
        return;
      }

      const token = localStorage.getItem("token");

      try {
        const res = await fetch(`http://localhost:5000/api/orders/${mealId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quantity,
            location: address,
            temperature: currentOrder.spicy,
            deliveryServicePrice: deliveryFee,
            governorate
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "فشل في إرسال الطلب");
        }

        successPopup.style.display = "flex";
      } catch (err) {
        alert("خطأ أثناء إرسال الطلب: " + err.message);
      }
    });
  