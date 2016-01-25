import os

from configurations import Configuration, values


class Core(Configuration):
    """Settings that will never change per-environment."""
    # Build paths inside the project like this: os.path.join(BASE_DIR, ...)
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    # Application definition
    INSTALLED_APPS = [
        'normandy.classifier',
        'normandy.recipes',
        'normandy.selfrepair',

        'adminsortable',
        'product_details',
        'rest_framework',
        'storages',

        'django.contrib.admin',
        'django.contrib.auth',
        'django.contrib.contenttypes',
        'django.contrib.sessions',
        'django.contrib.messages',
        'django.contrib.staticfiles',
    ]

    MIDDLEWARE_CLASSES = [
        'normandy.classifier.middleware.RequestReceivedAtMiddleware',
        'django.middleware.security.SecurityMiddleware',
        'django.contrib.sessions.middleware.SessionMiddleware',
        'django.middleware.common.CommonMiddleware',
        'django.middleware.csrf.CsrfViewMiddleware',
        'django.contrib.auth.middleware.AuthenticationMiddleware',
        'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
        'django.contrib.messages.middleware.MessageMiddleware',
        'django.middleware.clickjacking.XFrameOptionsMiddleware',
    ]

    ROOT_URLCONF = 'normandy.urls'

    TEMPLATES = [
        {
            'BACKEND': 'django.template.backends.django.DjangoTemplates',
            'DIRS': [],
            'APP_DIRS': True,
            'OPTIONS': {
                'context_processors': [
                    'django.template.context_processors.debug',
                    'django.template.context_processors.request',
                    'django.contrib.auth.context_processors.auth',
                    'django.contrib.messages.context_processors.messages',
                    'django.core.context_processors.static',
                ],
            },
        },
    ]

    WSGI_APPLICATION = 'normandy.wsgi.application'

    # Internationalization
    LANGUAGE_CODE = 'en-us'
    TIME_ZONE = 'UTC'
    USE_I18N = False
    USE_L10N = False
    USE_TZ = True

    # Static files (CSS, JavaScript, Images)
    STATIC_URL = '/static/'
    STATIC_ROOT = os.path.join(BASE_DIR, 'static')

    # User-uploaded Media
    MEDIA_URL = '/media/'
    MEDIA_ROOT = os.path.join(BASE_DIR, 'media')


class Base(Core):
    """Settings that may change per-environment, some with defaults."""
    SECRET_KEY = values.SecretValue()
    DEBUG = values.BooleanValue(False)
    ALLOWED_HOSTS = values.ListValue([])
    DATABASES = values.DatabaseURLValue('postgres://postgres@localhost/normandy')
    ADMINS = values.SingleNestedListValue([])

    EMAIL_HOST_USER = values.Value()
    EMAIL_HOST = values.Value()
    EMAIL_PORT = values.IntegerValue(587)
    EMAIL_USE_TLS = values.BooleanValue(True)
    EMAIL_HOST_PASSWORD = values.Value()

    EMAIL_BACKEND = values.Value('django.core.mail.backends.smtp.EmailBackend')

    # Overwrite old files when uploading media.
    DEFAULT_FILE_STORAGE = values.Value('storages.backends.overwrite.OverwriteStorage')

    # Password validation
    AUTH_PASSWORD_VALIDATORS = [
        {
            'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
        },
        {
            'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        },
        {
            'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
        },
        {
            'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
        },
    ]

    GEOIP2_DATABASE = values.Value()

    # Product-details
    PROD_DETAILS_STORAGE = values.Value('normandy.recipes.storage.ProductDetailsRelationalStorage')


class Development(Base):
    """Settings for local development."""
    DOTENV_EXISTS = os.path.exists(os.path.join(Core.BASE_DIR, '.env'))
    DOTENV = '.env' if DOTENV_EXISTS else None

    SECRET_KEY = values.Value('not a secret')
    DEBUG = values.BooleanValue(True)
    AUTH_PASSWORD_VALIDATORS = values.ListValue([])
    INSTALLED_APPS = Base.INSTALLED_APPS + ['sslserver']
    EMAIL_BACKEND = values.Value('django.core.mail.backends.console.EmailBackend')

    GEOIP2_DATABASE = values.Value(os.path.join(Core.BASE_DIR, 'GeoLite2-Country.mmdb'))


class Production(Base):
    """Settings for the production environment."""
    STATICFILES_STORAGE = 'whitenoise.django.GzipManifestStaticFilesStorage'

    DEFAULT_FILE_STORAGE = 'storages.backends.s3boto.S3BotoStorage'
    AWS_ACCESS_KEY_ID = values.SecretValue()
    AWS_SECRET_ACCESS_KEY = values.SecretValue()
    AWS_STORAGE_BUCKET_NAME = values.SecretValue()


class Test(Base):
    SECRET_KEY = values.Value('not a secret')
    GEOIP2_DATABASE = values.Value(os.path.join(Core.BASE_DIR, 'GeoLite2-Country.mmdb'))
