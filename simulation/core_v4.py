
def simulate_core_v4(cars: int = 15, avg_trips_per_day: int = 40, days: int = 360):
    # --- OPERATIONAL METRICS ---
    annual_trips = avg_trips_per_day * days
    trips_per_car_per_day = avg_trips_per_day / cars if cars > 0 else 0
    utilization = (trips_per_car_per_day / 10) * 100 

    # --- FINANCIAL METRICS (UNIT ECONOMICS V4) ---
    # Per Service Assumptions
    FARE = 125000
    COMMISSION_PCT = 0.20
    TOLL = 18000
    DRIVER_PAY = 82000
    
    unit_revenue = FARE * COMMISSION_PCT # 25,000
    unit_cost = TOLL + DRIVER_PAY # 100,000 (Pass-through)
    
    # Totals
    gross_merchandise_value = annual_trips * FARE
    net_revenue = annual_trips * unit_revenue
    total_cost_of_sales = annual_trips * unit_cost
    
    # --- FIXED COSTS (MONTHLY) ---
    # AWS (2.5M) + Office (4.5M) + Payroll (12M) = 19M / month
    MONTHLY_BURN = 2500000 + 4500000 + 12000000
    months = days / 30
    total_fixed_costs = MONTHLY_BURN * months
    
    # --- PROFITABILITY ---
    ebitda = net_revenue - total_fixed_costs
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
            "fixed_costs": total_fixed_costs,
            "ebitda": ebitda,
            "margin_percent": round(margin_ebitda, 1)
        }
    }
