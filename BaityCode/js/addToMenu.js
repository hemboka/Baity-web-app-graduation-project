async function addMeal() {
  const name = document.getElementById("name").value.trim();
  const description = document.getElementById("description").value.trim();
  const price = document.getElementById("price").value;
  const category = document.getElementById("type").value;
  const cookTime = document.getElementById("cookTime").value;
  const messageDiv = document.getElementById("message");

  if (!name || !description || !price || !category || !cookTime) {
    messageDiv.textContent = "يرجى ملء جميع الحقول المطلوبة.";
    messageDiv.className = "error";
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/meals/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        name,
        description,
        price,
        category,
        cookTime
      })
    });

    const data = await res.json();

    if (res.ok) {
      messageDiv.textContent = "تمت إضافة الوجبة بنجاح!";
      messageDiv.className = "success";

      // إفراغ الحقول
      document.getElementById("name").value = "";
      document.getElementById("description").value = "";
      document.getElementById("price").value = "";
      document.getElementById("type").value = "";
      document.getElementById("cookTime").value = "";
    } else {
      messageDiv.textContent = data.message || "فشل في الإضافة.";
      messageDiv.className = "error";
    }
  } catch (err) {
    messageDiv.textContent = "حدث خطأ أثناء الاتصال بالسيرفر.";
    messageDiv.className = "error";
  }
}