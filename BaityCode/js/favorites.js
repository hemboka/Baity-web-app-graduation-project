
const token = localStorage.getItem("token");
const container = document.getElementById("favoritesContainer");
const emptyMessage = document.getElementById("emptyMessage");

async function fetchFavorites() {
  try {
    const res = await fetch("http://localhost:5000/api/users/customer/profile", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    const favoriteMeals = data.customer.favoriteMeals || [];

    renderFavorites(favoriteMeals);
  } catch (err) {
    console.error("فشل في جلب بيانات المفضلة", err);
    container.innerHTML = "";
    emptyMessage.style.display = "block";
    emptyMessage.textContent = "حدث خطأ أثناء تحميل المفضلة.";
  }
}

function renderFavorites(favoriteMeals) {
  container.innerHTML = "";

  if (favoriteMeals.length === 0) {
    emptyMessage.style.display = "block";
    return;
  }

  emptyMessage.style.display = "none";

  favoriteMeals.forEach((meal) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src='${meal.image || "../imges/food.png"}' onerror="this.src='../imges/food.png'" alt="${meal.name}" />
      <h4>${meal.name}</h4>
      <p>شيف: ${meal.chef?.name || "غير معروف"}</p>
      <div class="rating">
        <span><i class="fa fa-star"></i> ${meal.rating || "4.5"}</span>
        <i class="fa fa-heart" style="color:#e63946;" onclick="removeFavorite('${meal._id}')"></i>
      </div>
    `;

    container.appendChild(card);
  });
}

async function removeFavorite(mealId) {
  try {
    const res = await fetch(`http://localhost:5000/api/users/customer/favorite/${mealId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res.ok) {
      fetchFavorites();
    } else {
      alert("فشل في إزالة الوجبة من المفضلة.");
    }
  } catch (err) {
    console.error("فشل في حذف الوجبة من المفضلة", err);
  }
}

function goBack() {
  window.history.back();
}

fetchFavorites();
