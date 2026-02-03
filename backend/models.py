from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)
    full_name = Column(String)
    role = Column(String)
    balance = Column(Float, default=0.0)

class ISP(Base):
    __tablename__ = "isps"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    image_url = Column(String, nullable=True)

class Area(Base):
    __tablename__ = "areas"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)

class Connection(Base):
    __tablename__ = "connections"
    id = Column(Integer, primary_key=True, index=True)
    s_no = Column(Integer)
    isp_id = Column(Integer, ForeignKey("isps.id"))
    full_name = Column(String)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    phone_number = Column(String)
    package_name = Column(String)
    area_id = Column(Integer, ForeignKey("areas.id"))
    address = Column(String)
    box_id = Column(String) # Box & Splitter ID
    activation_date = Column(String)
    expiry_date = Column(String)
    status = Column(String, default="Active") # Active, Expired, Suspended
    pending_invoices = Column(Integer, default=0)
    monthly_bill = Column(Float, default=0.0)
    type = Column(String) # Broadband, etc.

    isp = relationship("ISP")
    area = relationship("Area")

class InventoryItem(Base):
    __tablename__ = "inventory_items"
    id = Column(Integer, primary_key=True, index=True)
    category = Column(String) # ROUTER, SWITCH, etc.
    name = Column(String)
    serial_number = Column(String, unique=True, nullable=True)
    status = Column(String) # WORKABLE, NON_WORKABLE, USED
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Staff(Base):
    __tablename__ = "staff"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    phone = Column(String)
    role = Column(String)
    cash = Column(Float, default=0.0)
    profile_pic = Column(String, nullable=True)

class Expense(Base):
    __tablename__ = "expenses"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(String)
    type = Column(String)
    amount = Column(Float)
    comments = Column(String)
    staff_name = Column(String)

class Bank(Base):
    __tablename__ = "banks"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String) # Bank Name e.g. HBL
    location = Column(String) # Location details if needed
    account_title = Column(String)
    account_number = Column(String)
    branch_name = Column(String)
    opening_balance = Column(Float, default=0.0)
    current_balance = Column(Float, default=0.0)
    status = Column(String, default="Active") # Active/Inactive
    logo_url = Column(String, nullable=True)

class DepositRequest(Base):
    __tablename__ = "deposit_requests"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True) # Optional for now if manual
    bank_id = Column(Integer, ForeignKey("banks.id"))
    amount = Column(Float)
    deposit_date = Column(String)
    payment_method = Column(String) # Cash, Online, Transfer
    proof_image = Column(String, nullable=True)
    status = Column(String, default="Pending") # Pending, Approved, Rejected
    admin_note = Column(String, nullable=True) # Rejection reason
    details = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    bank = relationship("Bank")
    user = relationship("User")

class Promise(Base):
    __tablename__ = "promises"
    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String)
    username = Column(String)
    date_created = Column(String)
    due_date = Column(String)
    comments = Column(String)
    phone_number = Column(String)
    status = Column(String, default="Pending")

class Voucher(Base):
    __tablename__ = "vouchers"
    id = Column(Integer, primary_key=True, index=True)
    number = Column(String, unique=True)
    amount = Column(Float)
    type = Column(String) # Every Month, One Time
    isp_name = Column(String)
    assigned_to = Column(String) # Staff Name
    created_at = Column(String)
    expiry_date = Column(String)
    batch_id = Column(String)
    is_used = Column(Boolean, default=False)

class SMSBot(Base):
    __tablename__ = "sms_bots"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    status = Column(String, default="Offline")
    last_sent = Column(String, default="---")
    slots = Column(Integer, default=0)
    username = Column(String)
    password = Column(String)
    created_at = Column(String)

class Complaint(Base):
    __tablename__ = "complaints"
    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(String, unique=True)
    status = Column(String) # OPEN, ASSIGNED, CLOSED
    priority = Column(String) # HIGH, CRITICAL
    title = Column(String)
    complaint_type = Column(String)
    created_at = Column(String)
    connection_details = Column(String)
    created_by = Column(String)
    assigned_to = Column(String)

class ActionQueue(Base):
    __tablename__ = "action_queue"
    id = Column(Integer, primary_key=True, index=True)
    status = Column(String, default="Pending") # Pending, Approved, Rejected
    full_name = Column(String)
    phone_number = Column(String)
    username = Column(String)
    address = Column(String)
    password = Column(String)
    isp_name = Column(String)
    package_name = Column(String)
    vlan = Column(String)
    activity_type = Column(String) # Installation, Complaint, etc.
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
