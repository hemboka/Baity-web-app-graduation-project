
    document.addEventListener("DOMContentLoaded", function () {
      const emailInput = document.getElementById("email");
      const passwordInput = document.getElementById("password");
      const nameInput = document.getElementById("name");
      const phoneInput = document.getElementById("phone");
      const nationalIdInput = document.getElementById("national-id");
      const loginBtn = document.querySelector(".login-btn");
      const chefBtn = document.getElementById("chefBtn");
      const customerBtn = document.getElementById("customerBtn");
      const nameGroup = document.getElementById("name-group");
      const nationalIdGroup = document.getElementById("national-id-group");
      const loginLink = document.getElementById("loginLink");

      let userType = "chef"; // الافتراضي

      function containsArabic(text) {
        const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;
        return arabicRegex.test(text);
      }

      function validateForm() {
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const password = passwordInput.value.trim();
        const nationalId = nationalIdInput.value.trim();

        const emailRegex = /^[a-zA-Z0-9]{1,24}@(gmail|yahoo|hotmail)\.com$/;
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;"'<>,.?~\\/-]).{8,12}$/;

        const isNameValid = name.length > 1 && !containsArabic(name);
        const isEmailValid = emailRegex.test(email) && !containsArabic(email);
        const isPasswordValid = passwordRegex.test(password) && !containsArabic(password);
        const isPhoneValid = phone.length >= 6 && !containsArabic(phone);
        const isNationalIdValid = nationalId.length >= 10;

        let isValid = false;

        if (userType === "chef") {
          isValid = isNameValid && isEmailValid && isPhoneValid && isPasswordValid && isNationalIdValid;
        } else {
          isValid = isNameValid && isEmailValid && isPhoneValid && isPasswordValid;
        }

        if (isValid) {
          loginBtn.classList.add("active");
        } else {
          // loginBtn.disabled = true;
          loginBtn.classList.remove("active");
        }
      }

      chefBtn.addEventListener("click", () => {
        userType = "chef";
        chefBtn.classList.add("active");
        customerBtn.classList.remove("active");
        nameGroup.style.display = "block";
        nationalIdGroup.style.display = "block";
        loginLink.href = "../pages/login.html";
        validateForm();
      });

      customerBtn.addEventListener("click", () => {
        userType = "customer";
        customerBtn.classList.add("active");
        chefBtn.classList.remove("active");
        nameGroup.style.display = "block";
        nationalIdGroup.style.display = "none";
        loginLink.href = "../pages/login.html";
        validateForm();
      });

      [nameInput, emailInput, phoneInput, passwordInput, nationalIdInput].forEach(input => {
        input.addEventListener("input", validateForm);
      });

      loginBtn.addEventListener("click", async function (e) {
        e.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const phoneNumber = phoneInput.value.trim();
        const nationalID = userType === "chef" ? nationalIdInput.value.trim() : null;

        const body = {
          name,
          email,
          password,
          role: userType,
          phoneNumber,
        };

        if (userType === "chef") {
          body.nationalID = nationalID;
        }

        try {
          const res = await fetch("http://localhost:5000/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          });

          const data = await res.json();

          if (res.ok) {
            alert("تم إنشاء الحساب بنجاح!");
            window.location.href = "../pages/login.html";
          } else {
            alert(data.message || "حدث خطأ أثناء التسجيل");
          }
        } catch (error) {
          alert("فشل الاتصال بالسيرفر");
          console.error(error);
        }
      });

      // الإظهار الافتراضي
      nameGroup.style.display = "block";
      nationalIdGroup.style.display = "block";
      loginLink.href = "../pages/login.html";
    });
  