    let meal;
    function parseJwt(token) {
      if (!token) return null;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    }
    const deliveryTimes = {
      'cairo': 60, 'giza': 50, 'alexandria': 45, 'dakahlia': 35, 'red sea': 30,
      'beheira': 35, 'fayoum': 30, 'gharbia': 30, 'ismailia': 25, 'menofia': 25,
      'minya': 30, 'qalyubia': 30, 'new valley': 25, 'suez': 25, 'aswan': 30,
      'assiut': 30, 'beni suef': 30, 'port said': 20, 'damietta': 25, 'sharqia': 35,
      'south sinai': 30, 'kafr el-sheikh': 30, 'matrouh': 35, 'luxor': 30,
      'qena': 30, 'north sinai': 30, 'sohag': 30
    };

    async function loadMealDetails() {
      const mealId = localStorage.getItem("mealId");
      if (!mealId) return;

      const res = await fetch(`http://localhost:5000/api/meals/${mealId}`);
      const data = await res.json();
      meal = data.meal;

      document.getElementById("meal-img").src = meal.image || "../imges/food.png";
      document.getElementById("meal-name").textContent = meal.name;
      document.getElementById("meal-rating").textContent = meal.averageRating || "0.0";
      document.getElementById("meal-chef").textContent = `شيف: ${meal.chef.name}`;
      document.getElementById("meal-description").textContent = meal.description;
      document.getElementById("meal-price").textContent = `${meal.price} ج.م`;

      // عرض اختيار الحار والبارد فقط إذا كانت الوجبة من النوع المناسب
      if (meal.category !== "وجبة رئيسية") {
        document.getElementById("spicy-options").style.display = "none";
      }

      const govSelect = document.getElementById("governorate");
      for (let gov in deliveryTimes) {
        const option = document.createElement("option");
        option.value = gov;
        option.textContent = gov;
        govSelect.appendChild(option);
      }
      
      const token = localStorage.getItem("token");
      const payload = parseJwt(token);
      const currentUserId = payload?.userId;

      const userRating = meal.ratings.find(r => r.user === currentUserId || r.user?._id === currentUserId);

      if (userRating) {
        updateStars(userRating.value); // تلوّن النجوم حسب تقييمه
      }
    }

    function updateCount(change) {
      const countEl = document.getElementById("meal-count");
      let count = parseInt(countEl.textContent);
      count = Math.max(1, count + change);
      countEl.textContent = count;
    }

    async function submitOrder() {
      const quantity = parseInt(document.getElementById("meal-count").textContent);
      const location = document.getElementById("location").value.trim();
      const governorate = document.getElementById("governorate").value;
      const token = localStorage.getItem("token");
      const deliveryServicePrice = 20;

      if (!location || !governorate) {
        alert("يرجى إدخال العنوان واختيار المحافظة.");
        return;
      }

      const orderBody = {
        quantity,
        location,
        governorate,
        deliveryServicePrice
      };

      if (meal.category === "وجبة رئيسية") {
        orderBody.temperature = document.querySelector('input[name="spicy"]:checked')?.value;
      }

      try {
        const res = await fetch(`http://localhost:5000/api/orders/${meal._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(orderBody)
        });

        const data = await res.json();

        if (res.ok) {
          document.getElementById("successModal").style.display = "flex";
        } else {
          alert("فشل الطلب: " + (data.message || "حاول مرة أخرى"));
        }
      } catch (err) {
        alert("خطأ في الاتصال بالسيرفر.");
        console.error(err);
      }
    }

    loadMealDetails();
    document.querySelectorAll('#ratingStars i').forEach(star => {
      star.onclick = async () => {
        const rating = parseInt(star.dataset.rate);
        const mealId = localStorage.getItem("mealId");
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/meals/rate/${mealId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rating }),
        });

        if (res.ok) {
          alert("تم إرسال تقييمك بنجاح");
          updateStars(rating);
        } else {
          alert("حدث خطأ أثناء إرسال التقييم");
        }
      };
    });

    function updateStars(rating) {
      document.querySelectorAll('#ratingStars i').forEach(star => {
        const rate = parseInt(star.dataset.rate);
        star.classList.toggle("active", rate <= rating);
      });
    }

