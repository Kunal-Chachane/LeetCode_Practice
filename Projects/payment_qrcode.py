import qrcode

upi_id = input("Enter your UPI ID: ")

phone_pay_url = f'upi://pay?pa={upi_id}&pn=Recipent%20Name&mc=1234'
paytm_url = f'upi://pay?pa={upi_id}&pn=Recipent%20Name&mc=1234'
google_pay_url = f'upi://pay?pa={upi_id}&pn=Recipent%20Name&mc=1234'

phone_pay_QR = qrcode.make(phone_pay_url)
paytm_QR = qrcode.make(paytm_url)
google_pay_QR = qrcode.make(google_pay_url)

phone_pay_QR.save('phone_pay.jepg')
paytm_QR.save('paytm.jepg')
google_pay_QR.save('google_pay.jepg')