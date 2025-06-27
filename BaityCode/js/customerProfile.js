
let isEditing = false;

async function fetchCustomerData() {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/users/customer/profile", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();

    if (res.ok) {
      document.getElementById("name").value = data.customer.name || "";
      document.getElementById("email").value = data.customer.email || "";
      document.getElementById("address").value = data.customer.address || "";
    } else {
      alert(data.message || "فشل في جلب البيانات");
    }
  } catch (err) {
    alert("فشل الاتصال بالسيرفر");
    console.error(err);
  }
}

async function updateCustomerData() {
  const token = localStorage.getItem("token");
  const updates = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    address: document.getElementById("address").value.trim(),
  };

  try {
    const res = await fetch("http://localhost:5000/api/users/customer/profile", {
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

function toggleAllEdit() {
  const fields = ['name', 'email', 'address'];
  isEditing = !isEditing;
  const paymentRadios = document.getElementsByName('payment');
  const otherInput = document.getElementById('otherCardInput');

  fields.forEach(id => document.getElementById(id).disabled = !isEditing);
  paymentRadios.forEach(r => r.disabled = !isEditing);
  otherInput.disabled = !isEditing;

  const icon = document.getElementById('editAllIcon');
  const text = document.getElementById('editAllText');

  if (!isEditing) {
    icon.textContent = 'edit';
    text.textContent = 'تعديل البيانات';
    updateCustomerData();
  } else {
    icon.textContent = 'save';
    text.textContent = 'حفظ ✅';
  }
}

function toggleOtherCardInput() {
  const isOther = document.querySelector('input[name="payment"][value="other"]').checked;
  document.getElementById('otherCardInput').style.display = isOther ? 'block' : 'none';
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "../pages/login.html";
}

fetchCustomerData();
