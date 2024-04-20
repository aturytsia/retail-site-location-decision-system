import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import norm

def plot_kde_with_varied_bandwidths(data, true_distribution=None, bandwidths=None):
    if bandwidths is None:
        bandwidths = [0.05, 0.337, 2.0]  # Given bandwidths

    x_range = np.linspace(min(data), max(data), 1000)
    
    plt.figure(figsize=(10, 6))

    if true_distribution is not None:
        plt.plot(x_range, true_distribution, color='grey', label='True Density')

    colors = ['red', 'black', 'green']
    for bw, color in zip(bandwidths, colors):
        kde = np.zeros_like(x_range)
        for point in data:
            kde += norm.pdf(x_range, point, bw)
        kde /= len(data) * bw
        
        plt.plot(x_range, kde, color=color, label=f'Bandwidth = {bw}')
    
    plt.title('Kernel Density Estimation with Varied Bandwidths')
    plt.xlabel('X')
    plt.ylabel('Density')
    plt.legend()
    plt.show()

# Generate a random sample of 100 points from a standard normal distribution
np.random.seed(42)
data = np.random.normal(0, 1, 100)

# True density for comparison (standard normal distribution)
x_range = np.linspace(min(data), max(data), 1000)
true_distribution = norm(0, 1).pdf(x_range)

plot_kde_with_varied_bandwidths(data, true_distribution)
