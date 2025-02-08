set -o errexit  # Exit on error

pip install -r requirements.txt  # Install dependencies

python manage.py collectstatic --no-input  # Collect static files
python manage.py migrate  # Apply database migrations