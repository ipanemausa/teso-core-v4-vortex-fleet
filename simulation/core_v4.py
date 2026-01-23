
def simulate_core_v4(cars: int = 35, avg_trips_per_day: int = 80, days: int = 365):
    annual_trips = avg_trips_per_day * days
    trips_per_car_per_day = avg_trips_per_day / cars if cars > 0 else 0
    utilization = (trips_per_car_per_day / 10) * 100  # 10 trips/day = 100% util (ajustable)

    return {
        "cars": cars,
        "avg_trips_per_day": avg_trips_per_day,
        "days": days,
        "annual_trips": annual_trips,
        "trips_per_car_per_day": round(trips_per_car_per_day, 2),
        "utilization_percent": round(utilization, 1),
    }
