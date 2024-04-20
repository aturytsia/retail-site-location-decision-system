import matplotlib.pyplot as plt
from matplotlib.font_manager import FontProperties

font = FontProperties(fname="/Users/oleksandr.turytsia/Desktop/Latin-Modern-Roman/lmroman10-bold.otf")

# Dataset
sizes = ["10x10", "100x100", "1000x1000", "10000x10000", "100000x100000"]
entries = [100, 10000, 1000000, 100000000, 10000000000]
times_seconds = [15.8523, 2.642 * 60, 26.4205 * 60, 4.4034 * 3600, 1.8347 * 24 * 3600]

# Convert times to hours for better visualization
times_hours = [time / 3600 for time in times_seconds]

# Create the graph
plt.figure(figsize=(10, 6))
plt.plot(sizes, times_hours, marker='o', linestyle='-')
plt.title('Time vs Dataset Size', fontproperties=font)
plt.xlabel('Dataset Size', fontproperties=font)
plt.ylabel('Time (hours)', fontproperties=font)
plt.grid(True)
plt.xticks(rotation=45)
plt.tight_layout()

# Display the graph
plt.show()