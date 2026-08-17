import os
import django
import urllib.request
import csv
import io

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from stocks.models import Stock

def seed():
    url = "https://archives.nseindia.com/content/equities/EQUITY_L.csv"
    req = urllib.request.Request(
        url, 
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
    )
    
    try:
        print("Fetching official NSE equities list...")
        with urllib.request.urlopen(req) as response:
            csv_content = response.read().decode('utf-8')
            
        print("Successfully fetched list. Parsing CSV data...")
        f = io.StringIO(csv_content)
        reader = csv.reader(f)
        header = next(reader)
        
        # Load existing stocks to avoid duplicate key violations
        existing_stocks = {s.symbol: s for s in Stock.objects.all()}
        
        to_create = []
        to_update = []
        
        for row in reader:
            if len(row) >= 3:
                symbol = row[0].strip()
                name = row[1].strip()
                series = row[2].strip()
                
                # Only include standard equity shares (EQ series)
                if series == "EQ":
                    # Append .NS suffix to match NSE ticker formatting in yfinance
                    db_symbol = f"{symbol}.NS"
                    
                    if db_symbol in existing_stocks:
                        stock_obj = existing_stocks[db_symbol]
                        if stock_obj.name != name:
                            stock_obj.name = name
                            to_update.append(stock_obj)
                    else:
                        to_create.append(Stock(symbol=db_symbol, name=name))
                        
        if to_create:
            Stock.objects.bulk_create(to_create)
            print(f"Created {len(to_create)} new stocks in the database.")
        if to_update:
            Stock.objects.bulk_update(to_update, ['name'])
            print(f"Updated {len(to_update)} existing stocks in the database.")
            
        print("Stock database seeding completed successfully.")
        
    except Exception as e:
        print("Seeding failed with error:", e)

if __name__ == "__main__":
    seed()
