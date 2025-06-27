let isEditing = false;
let chefId = "";

async function fetchChefData() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("لم يتم تسجيل الدخول");
      return;
    }

    const decoded = jwt_decode(token);
    chefId = decoded.userId;

    const res = await fetch(`http://localhost:5000/api/users/chef/${chefId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (res.ok) {
      document.getElementById("name").value = data.chef.name || "";
      document.getElementById("email").value = data.chef.email || "";
      document.getElementById("address").value = data.chef.address || "";
      document.getElementById("password").value = data.chef.password || "";
    } else {
      alert(data.message || "فشل في جلب البيانات");
    }
  } catch (err) {
    alert("فشل الاتصال بالسيرفر");
    console.error(err);
  }
}

async function updateChefData() {
  const token = localStorage.getItem("token");
  const updates = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    address: document.getElementById("address").value.trim(),
    password: document.getElementById("password").value.trim()
  };

  try {
    const res = await fetch(`http://localhost:5000/api/users/chef/${chefId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });

    const data = await res.json();

    if (res.ok) {
      alert("تم حفظ البيانات بنجاح");
    } else {
      alert(data.message || "حدث خطأ أثناء حفظ البيانات");
    }
  } catch (err) {
    alert("فشل الاتصال بالسيرفر");
    console.error(err);
  }
}

function toggleEdit() {
  const fields = ['name', 'email', 'address', 'password'];

  if (isEditing) {
    fields.forEach(id => document.getElementById(id).disabled = true);
    document.getElementById('editText').textContent = 'تعديل البيانات';
    document.getElementById('editIcon').textContent = 'edit';
    updateChefData();
  } else {
    fields.forEach(id => document.getElementById(id).disabled = false);
    document.getElementById('editText').textContent = 'حفظ ✅';
    document.getElementById('editIcon').textContent = 'save';
  }

  isEditing = !isEditing;
}

function goBack() {
  window.history.back();
}

function goTo(page) {
  window.location.href = page;
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "../pages/login.html";
}

fetchChefData();
