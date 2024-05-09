import matplotlib.pyplot as plt
from matplotlib.font_manager import FontProperties
from scipy.interpolate import CubicSpline

font = FontProperties(fname="/Users/oleksandr.turytsia/Desktop/Latin-Modern-Roman/lmroman10-bold.otf")

# Dataset
sizes = ["10x10", "100x100", "1000x1000"]
entries = [100, 10000, 1000000]
times_seconds = [1.7, 35.389, 5477.17]

# Convert times to hours for better visualization
times_hours = [time / 3600 for time in times_seconds]

# Interpolation
cs = CubicSpline(entries, times_hours, bc_type='natural')

# Smooth range of entries
entries_smooth = range(100, 1000000, 100)
times_smooth_hours = cs(entries_smooth)

# Create the graph
plt.figure(figsize=(10, 6))
plt.plot(entries_smooth, times_smooth_hours, marker='o', linestyle='-', linewidth=0.1)
plt.title('Time vs Dataset Size')
plt.xlabel('Dataset Size')
plt.ylabel('Time (hours)')
plt.grid(True)
plt.xticks(entries, sizes, rotation=45)
plt.tight_layout()

# Display the graph
plt.show()