        const authContainer = document.getElementById('auth-container');
        const appContainer = document.getElementById('app-container');
        
        let currentCalculatedBill = null; 

        window.onload = () => {
            const currentUser = localStorage.getItem('currentUser');
            if (currentUser) {
                showApp(JSON.parse(currentUser));
            }
        };

        function toggleAuth(type) {
            const loginForm = document.getElementById('login-form');
            const signupForm = document.getElementById('signup-form');
            
            if (type === 'signup') {
                loginForm.style.display = 'none';
                signupForm.style.display = 'block';
                signupForm.classList.add('fade-in');
            } else {
                signupForm.style.display = 'none';
                loginForm.style.display = 'block';
                loginForm.classList.add('fade-in');
            }
        }

     
        document.getElementById('form-signup').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const pass = document.getElementById('signup-pass').value;

           
            const user = { 
                name, 
                email, 
                pass, 
                bills: [],
                address: 'Tga Saray ', 
                phone: '09616678474', 
                avatar: 'https://i.pravatar.cc/150?img=12' 
            };
            
          
            let users = JSON.parse(localStorage.getItem('users') || '[]');
            if (users.find(u => u.email === email)) {
                alert('An account with this email already exists.');
                return;
            }

            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));

            alert('Account created! Please log in.');
            toggleAuth('login');
        });

      
        document.getElementById('form-login').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const pass = document.getElementById('login-pass').value;

            let users = JSON.parse(localStorage.getItem('users') || '[]');
            const foundUser = users.find(u => u.email === email && u.pass === pass);

            if (foundUser) {
             
                localStorage.setItem('currentUser', JSON.stringify(foundUser));
                showApp(foundUser);
            } else {
                alert('Invalid email or password. Try signing up first.');
            }
        });

        function logout() {
            localStorage.removeItem('currentUser');
            appContainer.style.display = 'none';
            authContainer.style.display = 'flex';
            document.getElementById('login-form').reset();
        }

   

        function getCurrentUser() {
            return JSON.parse(localStorage.getItem('currentUser'));
        }

        function showApp(user) {
            authContainer.style.display = 'none';
            appContainer.style.display = 'flex';
            
            updateProfileUI(user);
            loadDashboard(user);
            renderTable(user);
        }

        function updateUserInDB(updatedUser) {
            
            let users = JSON.parse(localStorage.getItem('users') || '[]');
            const index = users.findIndex(u => u.email === updatedUser.email); 
            
            if (index !== -1) {
                users[index] = updatedUser;
            } else {
                 
                 const fallBackIndex = users.findIndex(u => u.name === updatedUser.name && u.pass === updatedUser.pass);
                 if (fallBackIndex !== -1) {
                    users[fallBackIndex] = updatedUser;
                 }
            }
            localStorage.setItem('users', JSON.stringify(users));
        }



        let isEditing = false;

        function updateProfileUI(user) {
            document.getElementById('header-avatar').src = user.avatar || 'https://i.pravatar.cc/150?img=12';
            
            document.getElementById('profile-name-input').value = user.name;
            document.getElementById('profile-email-input').value = user.email;
            document.getElementById('profile-address-input').value = user.address || '';
            document.getElementById('profile-phone-input').value = user.phone || '';
            document.getElementById('profile-avatar-img').src = user.avatar || 'https://i.pravatar.cc/150?img=12';
        }

        function toggleEditProfile() {
            const inputs = document.querySelectorAll('.profile-input');
            const wrapper = document.getElementById('profile-avatar-wrapper');
            const editBtn = document.getElementById('btn-edit-toggle');
            const saveBtn = document.getElementById('btn-save-changes');

            isEditing = !isEditing;

            if (isEditing) {
                inputs.forEach(input => {
                    if (input.type !== 'password') input.disabled = false;
                });
                wrapper.classList.add('editing');
                editBtn.style.display = 'none';
                saveBtn.style.display = 'block';
                document.getElementById('profile-name-input').focus();
            } else {
                inputs.forEach(input => input.disabled = true);
                wrapper.classList.remove('editing');
                editBtn.style.display = 'block';
                saveBtn.style.display = 'none';
            }
        }

        function triggerImageUpload() {
            if (isEditing) {
                document.getElementById('file-upload').click();
            }
        }

        function handleImageUpload(input) {
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('profile-avatar-img').src = e.target.result;
                }
                reader.readAsDataURL(input.files[0]);
            }
        }

        function saveProfileChanges() {
            const user = getCurrentUser();
            
            user.name = document.getElementById('profile-name-input').value;
            user.email = document.getElementById('profile-email-input').value;
            user.address = document.getElementById('profile-address-input').value;
            user.phone = document.getElementById('profile-phone-input').value;
            user.avatar = document.getElementById('profile-avatar-img').src; 


            localStorage.setItem('currentUser', JSON.stringify(user));
            
            updateUserInDB(user);

            document.getElementById('header-avatar').src = user.avatar;

            toggleEditProfile();
            alert('Profile updated successfully!');
        }


        function navigate(page) {
            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
            const navElement = event ? event.currentTarget : document.querySelector(`.nav-item[onclick*="'${page}'"]`);
            if (navElement) {
                navElement.classList.add('active');
            }

            document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
            document.getElementById(`view-${page}`).classList.add('active');

            const titles = {
                'dashboard': 'Main Dashboard',
                'generate': 'Generate Bill',
                'result': 'Bill Results',
                'profile': 'Profile'
            };
            document.getElementById('breadcrumb').innerText = `Pages / ${page.charAt(0).toUpperCase() + page.slice(1)}`;
            document.getElementById('page-title').innerText = titles[page];
        }
                document.getElementById('calc-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const kwh = parseFloat(document.getElementById('input-kwh').value);
            const rate = parseFloat(document.getElementById('input-rate').value);
            const total = kwh * rate;

            document.getElementById('display-amount').innerText = `₱ ${total.toFixed(2)}`;
            document.getElementById('bill-result').style.display = 'block';
            document.getElementById('bill-result').classList.add('fade-in');

            currentCalculatedBill = {
                date: new Date().toLocaleDateString(),
                kwh: kwh,
                rate: rate,
                total: total,
                status: 'Unpaid'
            };
        });

        function saveBill() {
            if (!currentCalculatedBill) return;

            let user = getCurrentUser();
            if (!user.bills) user.bills = [];
            
            user.bills.push(currentCalculatedBill);
            
           
            localStorage.setItem('currentUser', JSON.stringify(user));
            updateUserInDB(user);

            alert('Bill saved successfully!');
            document.getElementById('bill-result').style.display = 'none';
            document.getElementById('calc-form').reset();
            

            loadDashboard(user);
            renderTable(user);
        }

        function generateReceiptHTML(billData, user) {
            const billNumber = (user.bills.length || 0) + 1; 
            
            return `
                <div style="text-align: center; border-bottom: 2px dashed #ccc; padding-bottom: 15px; margin-bottom: 15px;">
                    <h2 style="color: var(--dark-blue); margin-bottom: 5px;">ELECTRIC BILLING RECEIPT</h2>
                    <p style="font-size: 0.8rem; color: #666;">** NOT OFFICIAL RECEIPT **</p>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <p style="font-weight: bold; margin-bottom: 10px; color: #333;">Billing Information:</p>
                    <table style="width: 100%; font-size: 0.9rem; border-collapse: collapse;">
                        <tr><td style="padding: 5px 0; border: none;">Name:</td><td style="text-align: right; font-weight: 600; padding: 5px 0; border: none;">${user.name}</td></tr>
                        <tr><td style="padding: 5px 0; border: none;">Address:</td><td style="text-align: right; padding: 5px 0; border: none;">${user.address || 'N/A'}</td></tr>
                        <tr><td style="padding: 5px 0; border: none;">Bill #:</td><td style="text-align: right; font-weight: 600; padding: 5px 0; border: none;">${billNumber}</td></tr>
                        <tr><td style="padding: 5px 0; border: none;">Date:</td><td style="text-align: right; padding: 5px 0; border: none;">${billData.date}</td></tr>
                    </table>
                </div>

                <div style="border-top: 2px solid #333; border-bottom: 2px solid #333; padding: 15px 0; margin-bottom: 20px;">
                    <p style="font-weight: bold; margin-bottom: 10px; color: #333;">Consumption Details:</p>
                    <table style="width: 100%; font-size: 0.9rem; border-collapse: collapse;">
                        <tr><td style="padding: 5px 0; border: none;">Consumption:</td><td style="text-align: right; padding: 5px 0; border: none;">${billData.kwh.toFixed(2)} kWh</td></tr>
                        <tr><td style="padding: 5px 0; border: none;">Rate per kWh:</td><td style="text-align: right; padding: 5px 0; border: none;">₱ ${billData.rate.toFixed(2)}</td></tr>
                        <tr><td style="padding: 5px 0; border: none;">Status:</td><td style="text-align: right; padding: 5px 0; border: none; color: ${billData.status === 'Paid' ? 'green' : 'red'}; font-weight: 600;">${billData.status}</td></tr>
                    </table>
                </div>

                <div style="text-align: right; font-size: 1.5rem; color: var(--primary-blue); font-weight: 700;">
                    TOTAL DUE: ₱ ${billData.total.toFixed(2)}
                </div>

                <div style="margin-top: 30px; text-align: center; font-size: 0.75rem; color: #999;">
                    <p>Thank you for using the Electric Bill Calculator.</p>
                    <p>Generated on ${new Date().toLocaleString()}.</p>
                </div>
            `;
        }

        function printReceipt(billData) {
            const user = getCurrentUser();
            const receiptModal = document.getElementById('receipt-modal');
            const receiptContent = document.getElementById('receipt-content');
            
            receiptContent.innerHTML = generateReceiptHTML(billData, user);
            receiptModal.style.display = 'flex'; 

            setTimeout(() => {
                window.print();
                closeReceiptModal();
            }, 100);
        }

        function closeReceiptModal() {
            document.getElementById('receipt-modal').style.display = 'none';
        }

        function downloadCurrentReceipt() {
            if (currentCalculatedBill) {
                printReceipt(currentCalculatedBill);
            } else {
                alert('Please calculate a bill first.');
            }
        }

        function downloadBillFromHistory(index) {
            const user = getCurrentUser();
            const billData = user.bills[index];
            if (billData) {
                printReceipt(billData);
            }
        }


        function renderTable(user) {
            const tbody = document.getElementById('results-body');
            tbody.innerHTML = '';
            
            if(user.bills && user.bills.length > 0) {
                user.bills.forEach((bill, index) => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${bill.date}</td>
                        <td>${bill.kwh} kWh</td>
                        <td>₱${bill.rate}</td>
                        <td style="font-weight:bold;">₱${bill.total.toFixed(2)}</td>
                        <td><span style="background:${bill.status === 'Paid' ? '#D1FAE5' : '#FEE2E2'}; color:${bill.status === 'Paid' ? '#065F46' : '#991B1B'}; padding: 5px 10px; border-radius: 15px; font-size: 0.8rem;">${bill.status}</span></td>
                        <td>
                            <i class="fas fa-download download-btn" onclick="downloadBillFromHistory(${index})" title="Download Receipt"></i>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
            } else {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#999;">No bills generated yet.</td></tr>';
            }
        }

        let myChart = null;
        function loadDashboard(user) {
            const bills = user.bills || [];
            

            const totalKwh = bills.reduce((acc, curr) => acc + curr.kwh, 0);
            const totalAmount = bills.reduce((acc, curr) => acc + curr.total, 0);

            document.getElementById('dash-consumption').innerText = `${totalKwh.toFixed(2)} kWh`;
            document.getElementById('dash-paid').innerText = `₱ ${totalAmount.toFixed(2)}`;
            document.getElementById('dash-bills').innerText = bills.length;

            const ctx = document.getElementById('consumptionChart').getContext('2d');
            const recentBills = bills.slice(-5);
            const labels = recentBills.map(b => b.date);
            const data = recentBills.map(b => b.total);

            if (myChart) myChart.destroy();

            myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels.length ? labels : ['No Data'],
                    datasets: [{
                        label: 'Bill Amount (₱)',
                        data: data.length ? data : [0],
                        backgroundColor: '#3B82F6',
                        borderRadius: 5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        }