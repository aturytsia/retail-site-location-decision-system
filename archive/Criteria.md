1. Location (0.509) Volume of passing trade (0.342) 17.44%
    - Can be estimated by using existing sales of an existing outlet.
        - We can estimate it by multiplying average food cost by amount [sold products](https://www.albert.cz/newsroom/zdrave-a-udrzitelne)
        - We can ask the owner
2. Location (0.509) Visibility (the distance from which the store is visible and recognizable to potential clients) (0.287) 14.62%
3. Competition (0.245) Distance to competition (0.591) 14.49%
    - Can be estimated using [dataset](https://data.brno.cz/datasets/89d09657b1464911a195249d18610677_0/explore?location=49.198755%2C16.640814%2C15.49)
4. Demographics (0.188) Potential market (TA) (0.519) 9.75%
    - Can be estimated using [dataset](https://data.brno.cz/datasets/b7c7e406ae894269bae7989f4784fab6_0/explore?location=49.195539%2C16.609779%2C15.97)
5. Location (0.509) Accessibility by car (0.191) 9.71%
    - Can be calculated using `leaflet-routing-machine`. I will take all the points of potential customers located the trading area and then calculate average driving time in seconds to a site. (Less is beter) 
6. Location (0.509) Accessibility by foot (0.180) 9.17%
    - The same algorithm as was for `accessibility by car`, but instead driving time I will use time by foot.
7. Competition (0.245) Brand recognition (0.227) 5.56%
8. Demographics (0.188) Seasonality (0.250) 4.69%
9. Establishment (0.057) Number of departments (0.575) 3.30%
10. Competition (0.245) Type of competition (0.128) 3.13%
11. Demographics (0.188) Growth in the area (0.147) 2.75%
12. Demographics (0.188) Socio-demographic
characteristics (0.085)
1.60%
13. Competition (0.245) Size of competition (0.055) 1.35%
14. Establishment (0.057) Sales floor area (0.179) 1.03%
15. Establishment (0.057) Parking (0.154) 0.88%
16. Establishment (0.057) Number of checkouts (0.092) 0.53%