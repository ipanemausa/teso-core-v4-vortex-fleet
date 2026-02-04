
def simulate_core_v4(cars: int = 15, avg_trips_per_day: int = 40, days: int = 360):
    # --- OPERATIONAL METRICS ---
    annual_trips = avg_trips_per_day * days
    trips_per_car_per_day = avg_trips_per_day / cars if cars > 0 else 0
    utilization = (trips_per_car_per_day / 10) * 100 

    # --- FINANCIAL METRICS (UNIT ECONOMICS V4) ---
    # MODELO: FLOTA AFILIADA (No Propia)
    # Supuestos de Negocio (Business Assumptions)
    FARE = 125000              # Tarifa Promedio (Aeropuerto)
    PLATFORM_COMMISSION = 0.20 # 20% Comisión Teso
    TOLL_COST = 18000          # Peaje Túnel (Cost of Service)
    
    # Platform Economics (Lo que le queda a la App)
    platform_revenue_per_trip = FARE * PLATFORM_COMMISSION # 25,000 COP
    
    # Driver Economics (Lo que le queda al Conductor)
    # El conductor recibe el 80% (100k), pero debe pagar el peaje (18k)
    driver_gross_share = FARE * (1 - PLATFORM_COMMISSION) # 100,000 COP
    driver_net_income = driver_gross_share - TOLL_COST    # 82,000 COP (Neto Conductor)

    # Totals
    gross_merchandise_value = annual_trips * FARE
    net_revenue = annual_trips * platform_revenue_per_trip # Real Revenue for Teso
    
    # --- COSTS & OPEX ---
    # Cost of Sales (Zero for Platform in Affiliated Model - Driver pays gas/tolls)
    # OPEX Monthly (Fixed)
    # AWS/Tech (2.5M) + Office/Ops (4.5M) + Payroll/Staff (12M) = 19M
    MONTHLY_BURN = 2500000 + 4500000 + 12000000
    months = days / 30
    total_opex = MONTHLY_BURN * months
    
    # --- PROFITABILITY ---
    ebitda = net_revenue - total_opex
    margin_ebitda = (ebitda / net_revenue) * 100 if net_revenue > 0 else 0

    return {
        "operational": {
            "cars": cars,
            "avg_trips_per_day": avg_trips_per_day,
            "days": days,
            "annual_trips": annual_trips,
            "trips_per_car_per_day": round(trips_per_car_per_day, 2),
            "utilization_percent": round(utilization, 1),
        },
        "financial": {
            "gmv": gross_merchandise_value,
            "net_revenue": net_revenue,
            "fixed_costs": total_opex,
            "ebitda": ebitda,
            "margin_percent": round(margin_ebitda, 1)
        },
        "unit_economics": {
            "fare": FARE,
            "commission_percent": 20,
            "platform_revenue": platform_revenue_per_trip,
            "driver_gross": driver_gross_share,
            "toll_deduction": TOLL_COST,
            "driver_net": driver_net_income
        }
    }
