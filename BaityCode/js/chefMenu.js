function showCategory(type) {
  const foodSection = document.getElementById("section-food");
  const sweetSection = document.getElementById("section-sweet");
  const btnFood = document.getElementById("btn-food");
  const btnSweet = document.getElementById("btn-sweet");

  if (type === "food") {
    foodSection.style.display = "grid";
    sweetSection.style.display = "none";
    btnFood.classList.add("active");
    btnSweet.classList.remove("active");
  } else {
    foodSection.style.display = "none";
    sweetSection.style.display = "grid";
    btnFood.classList.remove("active");
    btnSweet.classList.add("active");
  }
}

async function fetchMeals() {
  try {
    const response = await fetch("http://localhost:5000/api/meals");
    const data = await response.json();

    if (!response.ok) throw new Error(data.message);

    displayMeals(data.foodMeals, "section-food");
    displayMeals(data.dessertMeals, "section-sweet");
  } catch (err) {
    console.error("فشل في تحميل البيانات:", err.message);
  }
}

function displayMeals(meals, sectionId) {
  const section = document.getElementById(sectionId);
  section.innerHTML = "";

  if (!meals.length) {
    section.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: #777;">لا توجد وجبات</div>`;
    return;
  }

  meals.forEach(meal => {
    const item = document.createElement("div");
    item.className = "menu-item";
    item.innerHTML = `
      <img src='../imges/food.png' alt="${meal.name}" />
      <h4>${meal.name}</h4>
    `;
    section.appendChild(item);
  });
}

async function showName() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("لم يتم تسجيل الدخول");
      return;
    }

    const decoded = jwt_decode(token);
    const chefId = decoded.userId;

    const res = await fetch(`http://localhost:5000/api/users/chef/${chefId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (res.ok) {
      document.getElementById("chef-name").textContent = `شيف: ${data.chef.name}`;
    } else {
      document.getElementById("chef-name").textContent = "فشل في جلب الاسم";
    }
  } catch (err) {
    document.getElementById("chef-name").textContent = "خطأ في الاتصال";
    console.error(err);
  }
}

fetchMeals();
showName();