from database import SessionLocal, engine
import models
from passlib.context import CryptContext
import datetime

# Using sha256_crypt as bcrypt is having environment issues
pwd_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")

def seed_db():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Seed Users
    if not db.query(models.User).first():
        users = [
            models.User(
                username="mzahidtalib",
                password_hash=pwd_context.hash("mz@2917"),
                full_name="M Zahid Talib",
                role="CEO"
            ),
            models.User(
                username="ayazmalik",
                password_hash=pwd_context.hash("ayaz@123"),
                full_name="Ayaz Malik",
                role="ADMIN"
            ),
            models.User(
                username="aneesmalik",
                password_hash=pwd_context.hash("anees@123"),
                full_name="Anees Malik",
                role="MANAGER"
            ),
            models.User(
                username="hamzaadil",
                password_hash=pwd_context.hash("hamza@123"),
                full_name="Hamza Adil",
                role="CASHIER"
            ),
        ]
        db.add_all(users)

    # Seed ISPs
    if not db.query(models.ISP).first():
        isps = [
            models.ISP(name="Peak Fiber", image_url=None),
            models.ISP(name="Jazz", image_url="/logos/jazz.png"),
            models.ISP(name="PTCL", image_url="/logos/ptcl.png"),
            models.ISP(name="FlashFiber", image_url="/logos/flashfiber.png"),
            models.ISP(name="Google Fiber", image_url="/logos/google.png"),
            models.ISP(name="StarLink", image_url="/logos/starlink.png"),
        ]
        db.add_all(isps)

    # Seed Areas
    if not db.query(models.Area).first():
        areas = [
            models.Area(name="thokker"),
            models.Area(name="new lake city"),
            models.Area(name="D Block"),
            models.Area(name="A Block"),
            models.Area(name="B Block"),
        ]
        db.add_all(areas)

    # Seed Staff - 10 Members with Profile Pictures
    if not db.query(models.Staff).first():
        staff = [
            models.Staff(
                name="Salman Ali Khan", 
                phone="03117768900", 
                role="RMAN", 
                cash=5000,
                profile_pic="/staff/staff_profile_1_1769779443641.png"
            ),
            models.Staff(
                name="Ahmed Hassan", 
                phone="03117216487", 
                role="CASHIER", 
                cash=12500,
                profile_pic="/staff/staff_profile_2_1769779467625.png"
            ),
            models.Staff(
                name="Adeel Haider", 
                phone="03287860081", 
                role="MANAGER", 
                cash=8760,
                profile_pic="/staff/staff_profile_3_1769779486487.png"
            ),
            models.Staff(
                name="Bilal Raza", 
                phone="03001234567", 
                role="TECHNICIAN", 
                cash=3200,
                profile_pic="/staff/staff_profile_4_1769779507284.png"
            ),
            models.Staff(
                name="Kamran Iqbal", 
                phone="03219876543", 
                role="CASHIER", 
                cash=15600,
                profile_pic="/staff/staff_profile_5_1769779533696.png"
            ),
            models.Staff(
                name="Faisal Mahmood", 
                phone="03334567890", 
                role="TECHNICIAN", 
                cash=4100,
                profile_pic="/staff/staff_profile_6_1769779633642.png"
            ),
            models.Staff(
                name="Imran Sheikh", 
                phone="03451122334", 
                role="SUPERVISOR", 
                cash=6800,
                profile_pic="/staff/staff_profile_1_1769779443641.png"
            ),
            models.Staff(
                name="Tariq Hussain", 
                phone="03562233445", 
                role="ENGINEER", 
                cash=2900,
                profile_pic="/staff/staff_profile_2_1769779467625.png"
            ),
            models.Staff(
                name="Usman Malik", 
                phone="03673344556", 
                role="RMAN", 
                cash=7200,
                profile_pic="/staff/staff_profile_3_1769779486487.png"
            ),
            models.Staff(
                name="Zain Abbas", 
                phone="03784455667", 
                role="TECHNICIAN", 
                cash=3500,
                profile_pic="/staff/staff_profile_4_1769779507284.png"
            ),
        ]
        db.add_all(staff)

    # Seed Connections - 50 Dummy Users
    if not db.query(models.Connection).first():
        import random
        from datetime import datetime, timedelta
        
        first_names = ["Ahmed", "Ali", "Hassan", "Usman", "Bilal", "Faisal", "Kamran", "Imran", "Tariq", "Zain",
                      "Sara", "Ayesha", "Fatima", "Zainab", "Maryam", "Hina", "Sana", "Nida", "Rabia", "Amna"]
        last_names = ["Khan", "Ahmed", "Ali", "Malik", "Sheikh", "Hussain", "Raza", "Iqbal", "Haider", "Abbas"]
        
        packages = ["4 Mbps", "8 Mbps", "10 Mbps", "15 Mbps", "20 Mbps", "30 Mbps", "50 Mbps", "100 Mbps"]
        statuses = ["Active", "Active", "Active", "Active", "Expired", "Suspended"]  # More active users
        streets = ["Street 1", "Street 5", "Main Road", "Block A", "Block B", "Block C", "Phase 1", "Phase 2"]
        
        conns = []
        for i in range(1, 51):
            first_name = random.choice(first_names)
            last_name = random.choice(last_names)
            full_name = f"{first_name} {last_name}"
            username = f"{first_name.lower()}{last_name.lower()}{i}"
            
            # Random dates
            activation_days_ago = random.randint(30, 730)  # 1 month to 2 years ago
            activation_date = (datetime.now() - timedelta(days=activation_days_ago)).strftime("%Y-%m-%d")
            
            status = random.choice(statuses)
            if status == "Active":
                expiry_date = (datetime.now() + timedelta(days=random.randint(1, 60))).strftime("%Y-%m-%d")
                pending = random.choice([0, 0, 0, 1])  # Mostly paid up
            else:
                expiry_date = (datetime.now() - timedelta(days=random.randint(1, 30))).strftime("%Y-%m-%d")
                pending = random.randint(1, 3)
            
            conn = models.Connection(
                s_no=170000 + i,
                isp_id=random.randint(1, 6),  # Random ISP from 1-6
                full_name=full_name,
                username=username,
                password=f"user{i}123",
                phone_number=f"0300{random.randint(1000000, 9999999)}",
                package_name=random.choice(packages),
                area_id=random.randint(1, 5),  # Random area from 1-5
                address=f"House {random.randint(1, 999)}, {random.choice(streets)}",
                activation_date=activation_date,
                expiry_date=expiry_date,
                status=status,
                pending_invoices=pending,
                monthly_bill=random.choice([1000, 1500, 2000, 2500, 3000, 3500, 4000, 5000]),
                type=random.choice(["Broadband", "Broadband", "Broadband", "FTTH"])
            )
            conns.append(conn)
        
        db.add_all(conns)

    # Seed Banks
    if not db.query(models.Bank).first():
        banks = [
            models.Bank(name="HBL - Habib Bank Limited", location="Main Branch, Lahore", logo_url="/logos/hbl.png"),
            models.Bank(name="JazzCash Mobile Wallet", location="Digital Payment Service", logo_url="/logos/jazzcash.png"),
            models.Bank(name="EasyPaisa Mobile Wallet", location="Digital Payment Service", logo_url="/logos/easypaisa.png"),
        ]
        db.add_all(banks)

    # Seed Inventory - 50 Items with various statuses
    if not db.query(models.InventoryItem).first():
        import random
        
        # Define inventory categories and their items
        inventory_data = {
            "ROUTER": [
                "TP-Link Archer C6", "TP-Link TL-WR840N", "Tenda F3", "D-Link DIR-615",
                "Netgear R6120", "TP-Link Archer A7", "Asus RT-AC1200", "Mercusys MW301R"
            ],
            "SWITCH": [
                "8 Port Gigabit Switch", "16 Port Gigabit Switch", "24 Port Managed Switch",
                "5 Port Fast Ethernet", "TP-Link TL-SG108", "D-Link DGS-1008P"
            ],
            "BOX": [
                "Fiber Distribution Box 8-Core", "Fiber Distribution Box 16-Core",
                "Wall Mount Box", "Outdoor Junction Box", "Splice Closure Box"
            ],
            "FIBER_OPTIC": [
                "Single Mode Fiber 1km", "Single Mode Fiber 2km", "Multi Mode Fiber 500m",
                "Armored Fiber Cable", "Indoor Fiber Cable", "Outdoor Fiber Cable"
            ],
            "DUCT_PATTI": [
                "PVC Duct 2 inch", "PVC Duct 4 inch", "Flexible Conduit",
                "Cable Tray", "Underground Duct Pipe"
            ],
            "ODF": [
                "ODF 24 Port Rack Mount", "ODF 48 Port", "ODF 12 Port Wall Mount",
                "Fiber Patch Panel", "SC/UPC Adapter Panel"
            ],
            "CAT6": [
                "CAT6 Cable 305m Box", "CAT6 Patch Cable 1m", "CAT6 Patch Cable 3m",
                "CAT6 Outdoor Cable", "CAT6 Shielded Cable"
            ],
            "PATCH_CORD": [
                "SC-SC Patch Cord 3m", "LC-LC Patch Cord 5m", "SC-LC Patch Cord 2m",
                "FC-FC Patch Cord", "Multimode Patch Cord"
            ],
            "CATV_DEVICE": [
                "CATV Amplifier", "CATV Splitter 2-Way", "CATV Splitter 4-Way",
                "Coaxial Cable RG6", "F-Type Connector"
            ]
        }
        
        # Status options with realistic distribution
        statuses = ["IN_STOCK", "IN_STOCK", "IN_STOCK", "IN_USE", "IN_USE", "FAULTY", "NON_WORKABLE"]
        
        inventory_items = []
        item_counter = 1
        
        # Generate 50 items distributed across categories
        for category, items in inventory_data.items():
            # Determine how many items to create for this category
            items_to_create = min(len(items), 6)  # At least 6 items per category
            
            for i in range(items_to_create):
                if item_counter > 50:
                    break
                    
                item_name = items[i % len(items)]
                status = random.choice(statuses)
                
                # Generate serial number
                serial_prefix = category[:3].upper()
                serial_number = f"{serial_prefix}-{random.randint(100000, 999999)}"
                
                inventory_item = models.InventoryItem(
                    category=category,
                    name=item_name,
                    serial_number=serial_number,
                    status=status
                )
                inventory_items.append(inventory_item)
                item_counter += 1
            
            if item_counter > 50:
                break
        
        db.add_all(inventory_items)
        print(f"Seeded {len(inventory_items)} inventory items")

    # Seed Expenses (12+ Records)
    if not db.query(models.Expense).first():
        expenses = [
            models.Expense(date="2026-01-28", type="Fuel", amount=1500, comments="Bike fuel for field visits", staff_name="Salman Ali Khan"),
            models.Expense(date="2026-01-27", type="Office Utilities", amount=5000, comments="Electricity bill payment", staff_name="Adeel Haider"),
            models.Expense(date="2026-01-26", type="Refreshments", amount=850, comments="Tea/Lunch for staff", staff_name="Ahmed Hassan"),
            models.Expense(date="2026-01-25", type="Maintenance", amount=3200, comments="Splicing machine repair", staff_name="Bilal Raza"),
            models.Expense(date="2026-01-24", type="Fuel", amount=1200, comments="Generator fuel", staff_name="Kamran Iqbal"),
            models.Expense(date="2026-01-23", type="Stationery", amount=450, comments="Office stationery items", staff_name="Adeel Haider"),
            models.Expense(date="2026-01-22", type="Internet Bill", amount=10000, comments="Upstream bandwidth payment", staff_name="Adeel Haider"),
            models.Expense(date="2026-01-21", type="Fuel", amount=2000, comments="Field technicians bike fuel", staff_name="Faisal Mahmood"),
            models.Expense(date="2026-01-20", type="Equipment", amount=15000, comments="Purchased new fiber cables", staff_name="Tariq Hussain"),
            models.Expense(date="2026-01-19", type="Salary Advance", amount=5000, comments="Advance for Zain Abbas", staff_name="Adeel Haider"),
            models.Expense(date="2026-01-18", type="Maintenance", amount=1200, comments="Office AC repair", staff_name="Imran Sheikh"),
            models.Expense(date="2026-01-17", type="Fuel", amount=1800, comments="Site survey visits", staff_name="Usman Malik"),
        ]
        db.add_all(expenses)

    # Seed Action Queue (12+ Records)
    if not db.query(models.ActionQueue).first():
        actions = [
            models.ActionQueue(
                full_name="Muhammad Rizwan", phone_number="03001112223", username="rizwan1", address="House 12, Street 4, DHA",
                password="user123", isp_name="Peak Fiber", package_name="20 Mbps", vlan="101", activity_type="Installation", status="Pending"
            ),
            models.ActionQueue(
                full_name="Sara Ahmed", phone_number="03002223334", username="sara22", address="Flat 5, Block B, Johar Town",
                password="user123", isp_name="Jazz", package_name="10 Mbps", vlan="102", activity_type="Complaint", status="Pending"
            ),
            models.ActionQueue(
                full_name="Kashif Khan", phone_number="03003334445", username="kashif33", address="House 45, Lane 2, Wapda Town",
                password="user123", isp_name="PTCL", package_name="50 Mbps", vlan="103", activity_type="Shifting", status="Done"
            ),
            models.ActionQueue(
                full_name="Noman Ali", phone_number="03004445556", username="noman44", address="Shop 10, Main Market",
                password="user123", isp_name="FlashFiber", package_name="30 Mbps", vlan="104", activity_type="Installation", status="Approved"
            ),
            models.ActionQueue(
                full_name="Zahid Mahmood", phone_number="03005556667", username="zahid55", address="House 8, Street 1, Model Town",
                password="user123", isp_name="Peak Fiber", package_name="100 Mbps", vlan="105", activity_type="Recovery", status="Pending"
            ),
            models.ActionQueue(
                full_name="Ayesha Bibi", phone_number="03006667778", username="ayesha66", address="House 99, Block C, Askari 11",
                password="user123", isp_name="StormFiber", package_name="20 Mbps", vlan="106", activity_type="Installation", status="Pending"
            ),
            models.ActionQueue(
                full_name="Bilal Sheikh", phone_number="03007778889", username="bilal77", address="Plaza 3, 2nd Floor, Gulberg",
                password="user123", isp_name="Peak Fiber", package_name="50 Mbps", vlan="107", activity_type="Maintenance", status="Done"
            ),
            models.ActionQueue(
                full_name="Hassan Raza", phone_number="03008889990", username="hassan88", address="House 23, Street 5, Bahria Town",
                password="user123", isp_name="Nayatel", package_name="30 Mbps", vlan="108", activity_type="Installation", status="Pending"
            ),
            models.ActionQueue(
                full_name="Fahad Mustafa", phone_number="03009990001", username="fahad99", address="House 1, Lane 1, Valencia",
                password="user123", isp_name="Peak Fiber", package_name="15 Mbps", vlan="109", activity_type="Complaint", status="Approved"
            ),
            models.ActionQueue(
                full_name="Sadia Imam", phone_number="03001010101", username="sadia101", address="House 77, Street 9, DHA Phase 6",
                password="user123", isp_name="Jazz", package_name="25 Mbps", vlan="110", activity_type="Installation", status="Pending"
            ),
            models.ActionQueue(
                full_name="Omer Sharif", phone_number="03002020202", username="omer202", address="House 33, Street 3, Garden Town",
                password="user123", isp_name="PTCL", package_name="8 Mbps", vlan="111", activity_type="Shifting", status="Done"
            ),
            models.ActionQueue(
                full_name="Hamza Ali", phone_number="03003030303", username="hamza303", address="House 55, Street 2, Faisal Town",
                password="user123", isp_name="Peak Fiber", package_name="10 Mbps", vlan="112", activity_type="Recovery", status="Pending"
            ),
        ]
        db.add_all(actions)



    # Seed Deposits (10+ Records)
    if not db.query(models.DepositRequest).first():
        deposits = [
            models.DepositRequest(status="Pending", amount=50000, details="Collected from DHA Area (Salman Ali)"),
            models.DepositRequest(status="Processed", amount=25000, details="Johar Town Recovery (Ahmed Hassan)"),
            models.DepositRequest(status="Pending", amount=12000, details="Partial recovery from Wapda Town"),
            models.DepositRequest(status="Processed", amount=100000, details="Weekly closing deposit - Main Office"),
            models.DepositRequest(status="Pending", amount=8500, details="Cash from new connections (Bilal Raza)"),
            models.DepositRequest(status="Rejected", amount=500, details="Invalid entry duplicate"),
            models.DepositRequest(status="Processed", amount=45000, details="Monthly corporate bill clearing"),
            models.DepositRequest(status="Pending", amount=3200, details="Late night collection"),
            models.DepositRequest(status="Processed", amount=15600, details="Kamran Iqbal - Cash Handover"),
            models.DepositRequest(status="Pending", amount=9000, details="Recovery from defaulters list"),
            models.DepositRequest(status="Processed", amount=67000, details="Bulk payment from Plaza 3"),
            models.DepositRequest(status="Pending", amount=4500, details="Misc. collections from field"),
        ]
        db.add_all(deposits)

    # Seed Promises (10+ Records)
    if not db.query(models.Promise).first():
        promises = [
            models.Promise(customer_name="Ali Khan", username="alikhan1", date_created="2026-01-25", due_date="2026-02-01", comments="Will pay salary day", phone_number="03001234567", status="Pending"),
            models.Promise(customer_name="Usman Tariq", username="usman22", date_created="2026-01-26", due_date="2026-01-30", comments="Out of city, will pay on return", phone_number="03211234567", status="Pending"),
            models.Promise(customer_name="Fiza Ali", username="fiza33", date_created="2026-01-20", due_date="2026-01-25", comments="Promised via call", phone_number="03331234567", status="Settled"),
            models.Promise(customer_name="Hamza Shah", username="hamza44", date_created="2026-01-28", due_date="2026-02-05", comments="Salary issue", phone_number="03451234567", status="Pending"),
            models.Promise(customer_name="Sana Malik", username="sana55", date_created="2026-01-27", due_date="2026-02-02", comments="Requested extension", phone_number="03011234567", status="Pending"),
            models.Promise(customer_name="Bilal Ahmed", username="bilal66", date_created="2026-01-15", due_date="2026-01-20", comments="Forgot to pay", phone_number="03021234567", status="Broken"),
            models.Promise(customer_name="Nida Yasir", username="nida77", date_created="2026-01-29", due_date="2026-02-03", comments="Will pay online", phone_number="03031234567", status="Pending"),
            models.Promise(customer_name="Omer Riaz", username="omer88", date_created="2026-01-25", due_date="2026-01-28", comments="Cash collection requested", phone_number="03041234567", status="Settled"),
            models.Promise(customer_name="Tariq Jamil", username="tariq99", date_created="2026-01-24", due_date="2026-01-31", comments="Shop closed, pay later", phone_number="03051234567", status="Pending"),
            models.Promise(customer_name="Zara Sheikh", username="zara00", date_created="2026-01-22", due_date="2026-01-27", comments="Bank issue", phone_number="03061234567", status="Pending"),
        ]
        db.add_all(promises)

    # Seed Complaints (10+ Records)
    if not db.query(models.Complaint).first():
        complaints = [
            models.Complaint(ticket_id="TKT-1001", status="OPEN", priority="HIGH", title="No Internet Access", complaint_type="Connectivity", created_at="2026-01-29", connection_details="User: alikhan1 (House 12)", created_by="System", assigned_to="Bilal Raza"),
            models.Complaint(ticket_id="TKT-1002", status="ASSIGNED", priority="MEDIUM", title="Slow Browsing Speed", complaint_type="Speed", created_at="2026-01-28", connection_details="User: usman22 (Flat 5)", created_by="Support", assigned_to="Faisal Mahmood"),
            models.Complaint(ticket_id="TKT-1003", status="CLOSED", priority="LOW", title="Router Reset Request", complaint_type="Configuration", created_at="2026-01-27", connection_details="User: fiza33", created_by="User", assigned_to="Admin"),
            models.Complaint(ticket_id="TKT-1004", status="OPEN", priority="CRITICAL", title="Fiber Cut in Street 4", complaint_type="Infrastructure", created_at="2026-01-30", connection_details="Area: DHA Phase 6", created_by="Field Staff", assigned_to="Unassigned"),
            models.Complaint(ticket_id="TKT-1005", status="ASSIGNED", priority="HIGH", title="Frequent Disconnection", complaint_type="Connectivity", created_at="2026-01-29", connection_details="User: hamza44", created_by="Support", assigned_to="Zain Abbas"),
            models.Complaint(ticket_id="TKT-1006", status="OPEN", priority="MEDIUM", title="Payment not reflecting", complaint_type="Billing", created_at="2026-01-30", connection_details="User: sana55", created_by="Accounts", assigned_to="Ahmed Hassan"),
            models.Complaint(ticket_id="TKT-1007", status="CLOSED", priority="LOW", title="Change WiFi Password", complaint_type="Request", created_at="2026-01-26", connection_details="User: bilal66", created_by="User", assigned_to="Admin"),
            models.Complaint(ticket_id="TKT-1008", status="OPEN", priority="HIGH", title="Red Light on ONU", complaint_type="Hardware", created_at="2026-01-29", connection_details="User: nida77", created_by="User", assigned_to="Bilal Raza"),
            models.Complaint(ticket_id="TKT-1009", status="ASSIGNED", priority="MEDIUM", title="Packet Loss", complaint_type="Quality", created_at="2026-01-28", connection_details="User: omer88", created_by="Support", assigned_to="Faisal Mahmood"),
            models.Complaint(ticket_id="TKT-1010", status="OPEN", priority="LOW", title="Shift Connection", complaint_type="Request", created_at="2026-01-30", connection_details="User: tariq99", created_by="User", assigned_to="Admin"),
        ]
        db.add_all(complaints)

    # Seed SMS Bots (3 Records)
    if not db.query(models.SMSBot).first():
        bots = [
            models.SMSBot(name="Marketing Bot 1", status="Online", last_sent="5 mins ago", slots=500, username="bot_marketing", password="secure_password", created_at="2026-01-01"),
            models.SMSBot(name="Billing Alerts", status="Offline", last_sent="1 day ago", slots=1000, username="bot_billing", password="secure_password", created_at="2026-01-01"),
            models.SMSBot(name="Support Auto-Reply", status="Online", last_sent="Just now", slots=200, username="bot_support", password="secure_password", created_at="2026-01-01"),
        ]
        db.add_all(bots)

    db.commit()

    db.close()

if __name__ == "__main__":
    seed_db()
    print("Database seeded successfully!")
