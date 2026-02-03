from fastapi import FastAPI, Depends, HTTPException, status # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from sqlalchemy.orm import Session # type: ignore
from typing import List, Optional
import datetime
import models
from database import engine, get_db
from pydantic import BaseModel # type: ignore
from passlib.context import CryptContext # type: ignore

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.staticfiles import StaticFiles
import os

# Mount the 'public' directory from frontend to serve static files (logos, etc.)
# We assume the backend is running from /backend, so we go up one level to find frontend
static_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend", "public")
if os.path.exists(static_path):
    app.mount("/logos", StaticFiles(directory=os.path.join(static_path, "logos")), name="logos")


pwd_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")

# Pydantic Schemas
class ISPBase(BaseModel):
    name: str
    image_url: Optional[str] = None

class ISPCreate(ISPBase):
    pass

class ISP(ISPBase):
    id: int
    class Config:
        from_attributes = True

class ConnectionBase(BaseModel):
    s_no: int
    isp_id: int
    full_name: str
    username: str
    password: str
    phone_number: str
    package_name: str
    area_id: int
    address: str
    box_id: Optional[str] = "BOX-01"
    activation_date: str
    expiry_date: str
    status: str = "Active"
    pending_invoices: int = 0
    monthly_bill: float = 0.0
    type: str = "Broadband"

class ConnectionCreate(ConnectionBase):
    pass

class Connection(ConnectionBase):
    id: int
    class Config:
        from_attributes = True

class StaffCreate(BaseModel):
    name: str
    phone: str
    role: str
    cash: float = 0.0
    profile_pic: Optional[str] = None

class AreaCreate(BaseModel):
    name: str

class ExpenseCreate(BaseModel):
    date: str
    type: str
    amount: float
    comments: str
    staff_name: str

class BankCreate(BaseModel):
    name: str
    location: str

class PromiseCreate(BaseModel):
    customer_name: str
    username: str
    date_created: str
    due_date: str
    comments: str
    phone_number: Optional[str] = None

class VoucherCreate(BaseModel):
    amount: float
    type: str
    isp_name: str
    assigned_to: str
    expiry_date: str
    batch_id: Optional[str] = None
    count: Optional[int] = 1 # Added for batch generation logic

class SMSBotCreate(BaseModel):
    name: str
    username: str
    password: str
    created_at: str

class ComplaintCreate(BaseModel):
    ticket_id: str
    status: str
    priority: str
    title: str
    complaint_type: str
    created_at: str
    connection_details: str
    created_by: str
    assigned_to: str

class DepositRequestCreate(BaseModel):
    amount: float
    details: str

class DepositRequest(BaseModel):
    id: int
    status: str
    amount: float
    details: str
    created_at: datetime.datetime
    class Config:
        from_attributes = True

class ActionQueueCreate(BaseModel):
    full_name: str
    phone_number: str
    username: str
    address: str
    password: str
    isp_name: str
    package_name: str
    vlan: str
    activity_type: str

class ActionQueue(BaseModel):
    id: int
    status: str
    full_name: str
    phone_number: str
    username: str
    address: str
    password: str
    isp_name: str
    package_name: str
    vlan: str
    activity_type: str
    created_at: datetime.datetime
    class Config:
        from_attributes = True

# Endpoints

@app.get("/")
async def root():
    return {"message": "Peak Fiber Dynamic API is running"}

@app.get("/api/dashboard/summary")
def get_dashboard_summary(db: Session = Depends(get_db)):
    connections = db.query(models.Connection).all()
    deposits = db.query(models.DepositRequest).filter(models.DepositRequest.status == "Processed").all()
    staff = db.query(models.Staff).all()
    
    total_monthly_revenue = sum([c.monthly_bill for c in connections])
    staff_cash = sum([s.cash for s in staff])
    bank_cash = sum([d.amount for d in deposits])
    
    # Simple logic: Collection = Staff Cash + Bank Cash
    currently_collected = staff_cash + bank_cash
    missing = total_monthly_revenue - currently_collected
    
    return {
        "total_receivable": total_monthly_revenue,
        "in_hand_cash": currently_collected,
        "missing_amount": max(0, missing),
        "active_users": len([c for c in connections if c.status == "Active"]),
        "expired_users": len([c for c in connections if c.status != "Active"])
    }

# Login
@app.post("/api/login")
async def login(data: dict, db: Session = Depends(get_db)):
    username = data.get("username")
    password = data.get("password")
    
    print(f"Login attempt for: {username}")
    
    # Hardcoded fallback for emergency access
    if username == "mzahidtalib" and password == "mz@2917":
        user_obj = db.query(models.User).filter(models.User.username == "mzahidtalib").first()
        uid = user_obj.id if user_obj else 1
        bal = user_obj.balance if user_obj else 0.0
        return {"status": "success", "user": {"id": uid, "name": "M Zahid Talib", "role": "CEO", "balance": bal}}
    
    user = db.query(models.User).filter(models.User.username == username).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    # Verify password using the hash
    if pwd_context.verify(password, user.password_hash):
        return {"status": "success", "user": {"id": user.id, "name": user.full_name, "role": user.role, "balance": user.balance}}
    
    raise HTTPException(status_code=401, detail="Invalid username or password")

@app.get("/api/reset-db")
def reset_db():
    from database import engine
    from seed import seed_db
    import os
    
    # Close connections first (not always easy in FastAPI but we'll try)
    db_path = "peakfiber.db"
    
    try:
        if os.path.exists(db_path):
            # This is a bit aggressive but helps during dev when tables change
            # Alternatively, one should use migrations like Alembic
            pass 
        
        models.Base.metadata.drop_all(bind=engine)
        models.Base.metadata.create_all(bind=engine)
        seed_db()
        return {"message": "Database reset and re-seeded successfully"}
    except Exception as e:
        return {"error": str(e)}

# Users
@app.get("/api/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()


# ISPs
@app.get("/api/isps")
def get_isps(db: Session = Depends(get_db)):
    return db.query(models.ISP).all()

@app.post("/api/isps")
def create_isp(isp: ISPCreate, db: Session = Depends(get_db)):
    db_isp = models.ISP(name=isp.name, image_url=isp.image_url)
    db.add(db_isp)
    db.commit()
    db.refresh(db_isp)
    return db_isp

# Connections
@app.get("/api/connections")
def get_connections(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Connection)
    # Simple mock filtering for status if needed
    return query.all()

@app.post("/api/connections")
def create_connection(conn: ConnectionCreate, db: Session = Depends(get_db)):
    db_conn = models.Connection(**conn.model_dump())
    db.add(db_conn)
    db.commit()
    db.refresh(db_conn)
    return db_conn

@app.post("/api/connections/{id}/pay")
def pay_bill(id: int, data: dict, db: Session = Depends(get_db)):
    conn = db.query(models.Connection).get(id)
    if not conn:
        raise HTTPException(status_code=404, detail="Connection not found")
    
    amount = data.get("amount", conn.monthly_bill)
    staff_id = data.get("staff_id")
    
    # Update connection expiry by 30 days
    try:
        from datetime import datetime, timedelta
        current_expiry = datetime.strptime(conn.expiry_date, "%Y-%m-%d")
        new_expiry = current_expiry + timedelta(days=30)
        conn.expiry_date = new_expiry.strftime("%Y-%m-%d")
        conn.status = "Active"
        conn.pending_invoices = max(0, conn.pending_invoices - 1)
    except:
        pass # Fallback if date format is weird

    # Update staff cash
    if staff_id:
        staff = db.query(models.Staff).get(staff_id)
        if staff:
            staff.cash += amount
            
    db.commit()
    return {"message": "Payment processed successfully", "new_expiry": conn.expiry_date}

# Staff
@app.get("/api/staff")
def get_staff(db: Session = Depends(get_db)):
    return db.query(models.Staff).all()

@app.post("/api/staff")
def create_staff(staff: StaffCreate, db: Session = Depends(get_db)):
    db_staff = models.Staff(**staff.model_dump())
    db.add(db_staff)
    db.commit()
    db.refresh(db_staff)
    return db_staff

@app.post("/api/staff/{id}/reset-cash")
def reset_staff_cash(id: int, db: Session = Depends(get_db)):
    staff = db.query(models.Staff).get(id)
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    staff.cash = 0.0
    db.commit()
    return {"message": "Staff cash reset successfully"}

# Areas
@app.get("/api/areas")
def get_areas(db: Session = Depends(get_db)):
    return db.query(models.Area).all()

@app.post("/api/areas")
def create_area(area: AreaCreate, db: Session = Depends(get_db)):
    db_area = models.Area(name=area.name)
    db.add(db_area)
    db.commit()
    db.refresh(db_area)
    return db_area

# Action Queue (Mapping to a dynamic structure if needed, or just staying as is for now)
@app.get("/api/action-queue")
def get_queue(db: Session = Depends(get_db)):
    return db.query(models.ActionQueue).all()

@app.post("/api/action-queue")
def create_queue_item(item: ActionQueueCreate, db: Session = Depends(get_db)):
    db_item = models.ActionQueue(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.post("/api/action-queue/{id}/complete")
def complete_task(id: int, data: dict, db: Session = Depends(get_db)):
    task = db.query(models.ActionQueue).get(id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Update inventory item status to IN_USE if a serial number is provided
    sn = data.get("serial_number")
    if sn:
        item = db.query(models.InventoryItem).filter(models.InventoryItem.serial_number == sn).first()
        if item:
            item.status = "IN_USE"
    
    task.status = "Approved" # Marking as finished
    db.commit()
    return {"message": "Task completed and inventory updated"}


# Expenses
@app.get("/api/expenses")
def get_expenses(db: Session = Depends(get_db)):
    return db.query(models.Expense).all()

@app.post("/api/expenses")
def create_expense(exp: ExpenseCreate, db: Session = Depends(get_db)):
    db_exp = models.Expense(**exp.model_dump())
    db.add(db_exp)
    db.commit()
    db.refresh(db_exp)
    return db_exp

# Banks
@app.get("/api/banks")
def get_banks(db: Session = Depends(get_db)):
    return db.query(models.Bank).all()

@app.post("/api/banks")
def create_bank(bank: BankCreate, db: Session = Depends(get_db)):
    db_bank = models.Bank(**bank.model_dump())
    db.add(db_bank)
    db.commit()
    db.refresh(db_bank)
    return db_bank

# Deposits
@app.get("/api/deposits")
def get_deposits(db: Session = Depends(get_db)):
    return db.query(models.DepositRequest).all()

@app.post("/api/deposits")
def create_deposit(dep: DepositRequestCreate, db: Session = Depends(get_db)):
    db_dep = models.DepositRequest(**dep.model_dump())
    db.add(db_dep)
    db.commit()
    db.refresh(db_dep)
    return db_dep

@app.post("/api/deposits/{id}/process")
def process_deposit(id: int, db: Session = Depends(get_db)):
    dep = db.query(models.DepositRequest).get(id)
    if not dep:
        raise HTTPException(status_code=404, detail="Deposit not found")
    dep.status = "Processed"
    db.commit()
    return {"message": "Deposit processed successfully"}

# Promises
@app.get("/api/promises")
def get_promises(db: Session = Depends(get_db)):
    return db.query(models.Promise).all()

@app.post("/api/promises")
def create_promise(promise: PromiseCreate, db: Session = Depends(get_db)):
    db_p = models.Promise(**promise.model_dump())
    db.add(db_p)
    db.commit()
    db.refresh(db_p)
    return db_p

@app.post("/api/promises/{id}/settle")
def settle_promise(id: int, db: Session = Depends(get_db)):
    promise = db.query(models.Promise).get(id)
    if not promise:
        raise HTTPException(status_code=404, detail="Promise not found")
    promise.status = "Settled"
    db.commit()
    return {"message": "Promise settled"}

@app.delete("/api/promises/{id}")
def delete_promise(id: int, db: Session = Depends(get_db)):
    promise = db.query(models.Promise).get(id)
    if not promise:
        raise HTTPException(status_code=404, detail="Promise not found")
    db.delete(promise)
    db.commit()
    return {"message": "Promise deleted"}

# Vouchers
@app.get("/api/vouchers")
def get_vouchers(db: Session = Depends(get_db)):
    return db.query(models.Voucher).all()

@app.post("/api/vouchers")
def create_voucher(v: VoucherCreate, db: Session = Depends(get_db)):
    import random
    import string
    
    batch_id = v.batch_id or f"BATCH-{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}"
    created_vouchers = []
    
    for _ in range(v.count):
        # Generate unique 8-digit suffix
        suffix = ''.join(random.choices(string.digits, k=8))
        v_num = f"PF-{suffix}"
        
        db_v = models.Voucher(
            number=v_num,
            amount=v.amount,
            type=v.type,
            isp_name=v.isp_name,
            assigned_to=v.assigned_to,
            expiry_date=v.expiry_date,
            batch_id=batch_id,
            created_at=datetime.datetime.now().strftime('%d-%m-%Y'),
            is_used=False
        )
        db.add(db_v)
        created_vouchers.append(db_v)
    
    db.commit()
    for cv in created_vouchers:
        db.refresh(cv)
    
    return created_vouchers

# SMS Bots
@app.get("/api/sms-bots")
def get_sms_bots(db: Session = Depends(get_db)):
    return db.query(models.SMSBot).all()

@app.post("/api/sms-bots")
def create_sms_bot(bot: SMSBotCreate, db: Session = Depends(get_db)):
    db_bot = models.SMSBot(**bot.model_dump())
    db.add(db_bot)
    db.commit()
    db.refresh(db_bot)
    return db_bot

# Complaints
@app.get("/api/complaints")
def get_complaints(db: Session = Depends(get_db)):
    return db.query(models.Complaint).all()

@app.post("/api/complaints")
def create_complaint(c: ComplaintCreate, db: Session = Depends(get_db)):
    db_c = models.Complaint(**c.model_dump())
    db.add(db_c)
    db.commit()
    db.refresh(db_c)
    return db_c

@app.put("/api/complaints/{id}")
def update_complaint(id: int, data: dict, db: Session = Depends(get_db)):
    db_c = db.query(models.Complaint).get(id)
    if not db_c:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    if "status" in data:
        db_c.status = data["status"]
    if "assigned_to" in data:
        db_c.assigned_to = data["assigned_to"]
    
    db.commit()
    db.refresh(db_c)
    return db_c

# Inventory
@app.get("/api/inventory/summary")
def get_inventory_summary(db: Session = Depends(get_db)):
    from sqlalchemy import func 
    summary = db.query(models.InventoryItem.category, func.count(models.InventoryItem.id)).group_by(models.InventoryItem.category).all()
    return {cat: count for cat, count in summary}

@app.get("/api/inventory/{category}")
def get_inventory_by_category(category: str, db: Session = Depends(get_db)):
    items = db.query(models.InventoryItem).filter(models.InventoryItem.category == category.upper()).all()
    
    # Calculate summary with all statuses
    summary = {
        "total": len(items),
        "in_stock": len([i for i in items if i.status == "IN_STOCK"]),
        "in_use": len([i for i in items if i.status == "IN_USE"]),
        "faulty": len([i for i in items if i.status == "FAULTY"]),
        "non_workable": len([i for i in items if i.status == "NON_WORKABLE"]),
        # Legacy support for old status names
        "workable": len([i for i in items if i.status in ["WORKABLE", "IN_STOCK"]]),
        "used": len([i for i in items if i.status in ["USED", "IN_USE"]]),
    }
    
    return {"items": items, "summary": summary}


@app.post("/api/inventory")
def create_inventory_item(item: dict, db: Session = Depends(get_db)):
    db_item = models.InventoryItem(
        category=item.get("category").upper(),
        name=item.get("name"),
        serial_number=item.get("serial_number"),
        status=item.get("status", "IN_STOCK")
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


@app.get("/api/seed-inventory")
def seed_inventory(db: Session = Depends(get_db)):
    # Simple manual seed to have data to show
    if not db.query(models.InventoryItem).first():
        sample_items = [
            models.InventoryItem(category="ROUTER", name="TP-Link 840N", status="WORKABLE"),
            models.InventoryItem(category="ROUTER", name="TP-Link 840N", status="WORKABLE"),
            models.InventoryItem(category="ROUTER", name="TP-Link 840N", status="USED"),
            models.InventoryItem(category="ROUTER", name="Tenda F3", status="NON_WORKABLE"),
            models.InventoryItem(category="SWITCH", name="8 Port Gigabit", status="WORKABLE"),
            models.InventoryItem(category="SWITCH", name="16 Port Gigabit", status="USED"),
        ]
        db.add_all(sample_items)
        db.commit()
        return {"message": "Inventory seeded"}
    return {"message": "Already seeded"}


# --- UPDATED SCHEMAS FOR BANKS & DEPOSITS ---
class BankCreate(BaseModel):
    name: str
    location: Optional[str] = None
    account_title: str
    account_number: str
    branch_name: str
    opening_balance: float = 0.0

class DepositRequestCreate(BaseModel):
    user_id: Optional[int] = None
    bank_id: int
    amount: float
    deposit_date: str
    payment_method: str
    proof_image: Optional[str] = None
    details: Optional[str] = None

class DepositAction(BaseModel):
    status: str 
    admin_note: Optional[str] = None

# --- API ENDPOINTS ---

@app.get("/api/banks")
def get_banks(db: Session = Depends(get_db)):
    return db.query(models.Bank).all()

@app.post("/api/banks")
def create_bank(bank: BankCreate, db: Session = Depends(get_db)):
    db_bank = models.Bank(
        name=bank.name,
        location=bank.location,
        account_title=bank.account_title,
        account_number=bank.account_number,
        branch_name=bank.branch_name,
        opening_balance=bank.opening_balance,
        current_balance=bank.opening_balance
    )
    db.add(db_bank)
    db.commit()
    db.refresh(db_bank)
    return db_bank

@app.get("/api/deposit-requests")
def get_deposits(db: Session = Depends(get_db)):
    return db.query(models.DepositRequest).all()

@app.post("/api/deposit-requests")
def create_deposit_request(request: DepositRequestCreate, db: Session = Depends(get_db)):
    db_req = models.DepositRequest(
        user_id=request.user_id,
        bank_id=request.bank_id,
        amount=request.amount,
        deposit_date=request.deposit_date,
        payment_method=request.payment_method,
        proof_image=request.proof_image,
        details=request.details,
        status="Pending"
    )
    db.add(db_req)
    db.commit()
    db.refresh(db_req)
    return db_req

@app.put("/api/deposit-requests/{request_id}/action")
def action_deposit_request(request_id: int, action: DepositAction, db: Session = Depends(get_db)):
    request = db.query(models.DepositRequest).filter(models.DepositRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    if request.status != "Pending":
         raise HTTPException(status_code=400, detail="Request already processed")

    if action.status == "Approved":
        request.status = "Approved"
        # Update Bank Balance
        bank = db.query(models.Bank).filter(models.Bank.id == request.bank_id).first()
        if bank:
            bank.current_balance += request.amount
        
        # Update User Balance
        if request.user_id:
            user = db.query(models.User).filter(models.User.id == request.user_id).first()
            if user:
                user.balance += request.amount

    elif action.status == "Rejected":
        request.status = "Rejected"
        request.admin_note = action.admin_note
    
    db.commit()
    return {"message": f"Request {action.status}"}


if __name__ == "__main__":
    import uvicorn 
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
