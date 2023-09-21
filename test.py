import smtplib

# Configure SMTP settings here
smtp_server = 'smtp.gmail.com'
smtp_port = 587
smtp_username = 'anyassorstanley@gmail.com'
smtp_password = 'cnrxwfrfjvxrmbnl'

# Create an SMTP connection
try:
    server = smtplib.SMTP(smtp_server, smtp_port)
    server.starttls()
    server.login(smtp_username, smtp_password)
    server.quit()
    print('SMTP server connection successful')
except Exception as e:
    print('SMTP server connection failed:', e)
