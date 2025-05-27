from users.models import User, Page

# Create the 10 predefined pages
pages_data = [
    ("Products List", "products-list"),
    ("Marketing List", "marketing-list"),
    ("Order List", "order-list"),
    ("Media Plans", "media-plans"),
    ("Offer Pricing SKUs", "offer-pricing-skus"),
    ("Clients", "clients"),
    ("Suppliers", "suppliers"),
    ("Customer Support", "customer-support"),
    ("Sales Reports", "sales-reports"),
    ("Finance & Accounting", "finance-accounting"),
]

print("Creating pages...")
for name, slug in pages_data:
    page, created = Page.objects.get_or_create(
        slug=slug,
        defaults={'name': name, 'description': f'Page for {name}'}
    )
    if created:
        print(f"✅ Created page: {name}")
    else:
        print(f"📋 Page already exists: {name}")

# Create super admin user
print("\nCreating super admin...")
super_admin, created = User.objects.get_or_create(
    username='superadmin',
    defaults={
        'email': 'admin@example.com',
        'first_name': 'Super',
        'last_name': 'Admin',
        'is_super_admin': True,
        'is_staff': True,
        'is_superuser': True,
    }
)

if created:
    super_admin.set_password('admin123')  # Change this password!
    super_admin.save()
    print("✅ Created super admin user")
    print("   Username: superadmin")
    print("   Password: admin123")
    print("   ⚠️  CHANGE THIS PASSWORD IN PRODUCTION!")
else:
    print("📋 Super admin already exists")

print("\n🎉 Initial data setup complete!")
print("\nNext steps:")
print("1. Run: python manage.py runserver")
print("2. Visit Django admin at: http://localhost:8000/admin")
print("3. Login with superadmin/admin123")