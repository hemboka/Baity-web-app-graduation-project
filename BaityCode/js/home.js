
  const cardsContainer = document.getElementById("cards-container");
  const loader = document.getElementById("loader");
  const mainBtn = document.getElementById("main-btn");
  const sweetsBtn = document.getElementById("sweets-btn");
  const chefsBtn = document.getElementById("chefs-btn");
  const searchInput = document.getElementById("searchInput");

  const token = localStorage.getItem("token");
  let mealsData = { foodMeals: [], dessertMeals: [] };
  let chefsData = [];
  let currentView = "main";
  let favoriteMealIds = [];

  async function loadData() {
    try {
      loader.style.display = "block";

      const [mealsRes, chefsRes, favRes] = await Promise.all([
        fetch("http://localhost:5000/api/meals"),
        fetch("http://localhost:5000/api/users/chef"),
        fetch("http://localhost:5000/api/users/customer/profile", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const mealsJson = await mealsRes.json();
      const chefsJson = await chefsRes.json();
      const favJson = await favRes.json();

      mealsData = mealsJson;
      chefsData = chefsJson.chefs;
      favoriteMealIds = favJson.customer.favoriteMeals.map(fav => fav._id.toString()) || [];

      loader.style.display = "none";
      updateContent(mainDishesHTML(), mainBtn);
    } catch (err) {
      loader.textContent = "فشل تحميل البيانات";
      console.error("فشل تحميل البيانات:", err);
    }
  }

  function isFavorite(mealId) {
    return favoriteMealIds.includes(mealId.toString());
  }

  function heartElement(mealId) {
    const icon = document.createElement("i");
    icon.classList.add("fa-heart", isFavorite(mealId) ? "fa" : "fa-regular");
    if (isFavorite(mealId)) icon.style.color = "#e63946";

    icon.addEventListener("click", async (event) => {
      event.stopPropagation();
      try {
        const res = await fetch(`http://localhost:5000/api/users/customer/favorite/${mealId}`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` }
        });

        const result = await res.json();

        if (res.ok) {
          if (isFavorite(mealId)) {
            favoriteMealIds = favoriteMealIds.filter(id => id !== mealId);
          } else {
            favoriteMealIds.push(mealId);
          }
          updateContentByCurrentView();
        } else {
          alert(result.message || "فشل تعديل المفضلة");
        }
      } catch (err) {
        console.error("خطأ في تعديل المفضلة:", err);
      }
    });

    return icon;
  }

  function createMealCard(meal) {
    const card = document.createElement("div");
    card.className = "card";

    card.addEventListener("click", () => {
      goToMeal(meal._id);
    });

    card.innerHTML = `
      <img src="${meal.image || '../imges/food.png'}" onerror="this.src='../imges/food.png'" alt="${meal.name}" />
      <h4>${meal.name}</h4>
      <p>شيف: ${meal.chef?.name || "غير معروف"}</p>
    `;

    const ratingDiv = document.createElement("div");
    ratingDiv.className = "rating";
    ratingDiv.innerHTML = `<span><i class="fa fa-star"></i> ${meal.averageRating || "0.0"}</span>`;
    ratingDiv.appendChild(heartElement(meal._id));

    card.appendChild(ratingDiv);
    return card;
  }

  function updateContent(contentList, activeBtn) {
    cardsContainer.innerHTML = "";
    contentList.forEach(card => cardsContainer.appendChild(card));
    [mainBtn, sweetsBtn, chefsBtn].forEach(btn => btn.classList.remove("active"));
    activeBtn.classList.add("active");
  }

  function updateContentByCurrentView(query = "") {
    if (currentView === "main") updateContent(mainDishesHTML(query), mainBtn);
    else if (currentView === "sweets") updateContent(sweetsHTML(query), sweetsBtn);
    else updateContent(chefsHTML(query), chefsBtn);
  }

  function mainDishesHTML(query = "") {
    const meals = mealsData.foodMeals?.filter(m => m.name.toLowerCase().includes(query)) || [];
    return meals.length ? meals.map(createMealCard) : [noResult("لا توجد وجبات رئيسية متاحة حاليًا")];
  }

  function sweetsHTML(query = "") {
    const meals = mealsData.dessertMeals?.filter(m => m.name.toLowerCase().includes(query)) || [];
    return meals.length ? meals.map(createMealCard) : [noResult("لا توجد حلويات متاحة حاليًا")];
  }

  function chefsHTML(query = "") {
    const chefs = chefsData?.filter(c => c.name.toLowerCase().includes(query)) || [];
    if (chefs.length === 0) return [noResult("لا يوجد طباخين")];

    return chefs.map(chef => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${chef.profileImage || '../imges/chef.png'}" onerror="this.src='../imges/chef.png'" alt="${chef.name}" />
        <h4>شيف: ${chef.name}</h4>
        <div class="rating"><span><i class="fa fa-star"></i>${chef.averageRating || 0.0}</span></div>
      `;
      return card;
    });
  }

  function noResult(text) {
    const p = document.createElement("p");
    p.textContent = text;
    return p;
  }

  mainBtn.onclick = () => {
    currentView = "main";
    updateContent(mainDishesHTML(), mainBtn);
  };

  sweetsBtn.onclick = () => {
    currentView = "sweets";
    updateContent(sweetsHTML(), sweetsBtn);
  };

  chefsBtn.onclick = () => {
    currentView = "chefs";
    updateContent(chefsHTML(), chefsBtn);
  };

  searchInput.addEventListener("input", e => {
    const query = e.target.value.toLowerCase();
    updateContentByCurrentView(query);
  });

  function goToMeal(mealId) {
    localStorage.setItem("mealId", mealId);
    window.location.href = "../pages/mealDetails.html";
  }

  function exitWebsite() {
    if (window.history.length > 1) window.history.back();
    else window.location.href = "/index.html";
  }

  loadData();
