
# Prod checklist
1. delete all current bright data jobs on `production` before running `past 7 days` bright data api call
```sh
POST /worko-jobs/_delete_by_query
{
  "query": {
    "bool": {
      "must": [
        {
          "exists": {
            "field": "externalJobId"
          }
        },
        {
          "term": {
            "sourcedFrom.keyword": "BRIGHT_DATA_JOB"
          }
        }
      ]
    }
  }
}
```

```js
[
  "1mg",
  "Aakash Educational Services (AESL)",
  "Accenture",
  "Acuity Knowledge Partners",
  "Amadeus",
  "AMD",
  "AO Smith",
  "Acko",
  "Arzooo",
  "Ashok Leyland",
  "Asian Paints",
  "Audi",
  "Axis Bank",
  "Bajaj Finserv",
  "Bajaj Capital",
  "Bajaj Electricals",
  "Bankbazaar",
  "BCG",
  "Airtel",
  "Apple",
  "Britannia",
  "BYJUS",
  "Cadeploy Engineering",
  "Cafe Coffee Day (CCD)",
  "Cargill",
  "BillDesk",
  "Cashfree Payments",
  "CDS",
  "Chai Point",
  "Chalo",
  "Cheil - Samsung",
  "CISCO",
  "Classteacher",
  "Clear",
  "Colgate Palmolive",
  "Blackbuck",
  "Croma",
  "Crompton Greaves",
  "Cuemath",
  "Dabur",
  "Dalmia Cement",
  "DBS Bank",
  "DCB Bank",
  "CarDekho",
  "DesignCafe",
  "DTDC Express",
  "DXC Technology",
  "Easemytrip",
  "Edelweiss Broking",
  "Ellevate K 12",
  "Enphase Energy",
  "Exide",
  "EXL",
  "Fashinza",
  "FICO",
  "Cashify",
  "Franchise India Holdings",
  "Gamooz Interactive Solutions",
  "Genpact",
  "Godrej",
  "Godrej Industries",
  "Grant Thornton",
  "Haier",
  "Happay",
  "Hatch",
  "Havells",
  "HCLTech",
  "HDB Financial Services",
  "HDFC Bank",
  "Hdfc Securities",
  "Hidesign",
  "Hindustan Wellness",
  "Hitachi",
  "Honeywell",
  "Hotstar",
  "Unilever",
  "Hyundai Motor",
  "IBM",
  "ICICI Bank",
  "Incred",
  "IndiaMart",
  "Indifi Technologies",
  "IndusInd Bank",
  "Innoviti Payment Solutions",
  "Darwinbox",
  "ITC",
  "Jacobs",
  "Jain Irrigation Systems",
  "Jaro Education",
  "Jio",
  "JK Lakshmi Cement",
  "Justdial",
  "KEC International",
  "Kent",
  "Khatabook",
  "Kimberly Clark",
  "Kotak Mahindra Bank",
  "Lambdatest"
]
```