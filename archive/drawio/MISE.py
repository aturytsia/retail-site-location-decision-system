import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression

# Generate some sample data
np.random.seed(0)
X = np.random.rand(50, 1) * 10
y = 2 * X + 1 + np.random.randn(50, 1) * 2

# Fit a linear regression model
model = LinearRegression()
model.fit(X, y)

# Make predictions using the model
y_pred = model.predict(X)

# Create a scatter plot of the data points
plt.scatter(X, y, label='Data points', color='blue')

# Plot the regression line
plt.plot(X, y_pred, color='red', label='Regression line')

plt.xlabel('X')
plt.ylabel('y')
plt.title('Linear Regression')
plt.legend()

plt.show()
