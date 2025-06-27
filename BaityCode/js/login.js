
  document.addEventListener("DOMContentLoaded", function () {
    const chefBtn = document.getElementById("chefBtn");
    const customerBtn = document.getElementById("customerBtn");
    const loginBtn = document.getElementById("loginBtn");
    const registerLink = document.getElementById("registerLink");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    let userType = "chef"; // النوع الافتراضي

    // اختيار النوع
    chefBtn.addEventListener("click", () => {
      userType = "chef";
      chefBtn.classList.add("active");
      customerBtn.classList.remove("active");
      registerLink.innerHTML = `هل أنت عضو جديد؟ <a href="../pages/signup.html">سجل الآن</a>`;
    });

    customerBtn.addEventListener("click", () => {
      userType = "customer";
      customerBtn.classList.add("active");
      chefBtn.classList.remove("active");
      registerLink.innerHTML = `هل أنت عضو جديد؟ <a href="../pages/signup.html">سجل الآن</a>`;
    });

    // التحقق من وجود حروف عربية
    function containsArabic(text) {
      const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;
      return arabicRegex.test(text);
    }

    // التحقق من صحة البيانات
    function validateForm() {
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      const emailRegex = /^[a-zA-Z0-9]{1,24}@(gmail|yahoo|hotmail)\.com$/;
      const isEmailValid = emailRegex.test(email) && !containsArabic(email);
      const isPasswordValid = password.length >= 6 && !containsArabic(password);
    }

    // حدث على التغيير في الحقول
    emailInput.addEventListener("input", validateForm);
    passwordInput.addEventListener("input", validateForm);

    // تنفيذ تسجيل الدخول
    loginBtn.addEventListener("click", async function (e) {
      e.preventDefault();

      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      const body = {
        email,
        password,
      };

      try {
        const res = await fetch("http://localhost:5000/api/auth/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        });
        
        const data = await res.json();
        if (res.ok) {
          // نفك التوكن ونجيب الـ role
          const token = data.token;
          const payload = JSON.parse(atob(token.split('.')[1]));
          const roleFromToken = payload.role;

          // تحقق من تطابق النوع
          if (roleFromToken !== userType) {
            alert("نوع الحساب لا يتطابق مع النوع الذي اخترته");
            return;
          }

          // تخزين البيانات
          localStorage.setItem("token", token);
          alert("تم تسجيل الدخول بنجاح!");

          // التوجيه
          if (userType === "chef") {
            window.location.href = "../pages/chefMenu.html";
          } else {
            window.location.href = "../pages/Home.html";
          }
        } else {
          alert(data.message || "فشل تسجيل الدخول");
        }

      } catch (error) {
        console.error("Error:", error);
        alert("حدث خطأ أثناء الاتصال بالسيرفر.");
      }
    });

    // التفعيل المبدئي للحالة
    validateForm();
  });
