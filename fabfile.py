# coding: utf-8
from fabric.api import env, task
from fabric.operations import put, local, run
from fabric.context_managers import prefix
from fabric.contrib.project import rsync_project
from fabric.contrib.console import confirm

# Тестирование на всех платформах приветствуется
# В особенности под win.

env.user = 'remote_user'
env.hosts = ['remote_ip']


EXCLUDE_FILES = ('node_modules',
                 'app',
                 'local_settings.py',
                 '__pycache__',
                 'gulpfile.js',
                 'package.json',
                 '.DS_Store',
                 '.hg',
                 '.git',
                 )

APPS = ('main', 'events', 'gallery')

VIRTUALENV_DEV_PATH = 'virtualenv'
VIRTUALENV_PROD_PATH = 'virtualenv'

DEV_PATH = 'dev/backend/ignatovich-backend/'
PROD_PATH = 'dev/backend/ignatovich-backend/'

DEV_GUNICORN_FILENAME = 'gunicorn_ignatovich_dev.pid'
PROD_GUNICORN_FILENAME = 'gunicorn_ignatovich_dev.pid'


def deploy(project_path, exclude_files, virtualenv, gunicorn_name):
    for app in APPS:
        # sync app dirs.
        rsync_project(local_dir=app, remote_dir=DEV_PATH, exclude=exclude_files, delete=True)

    # migrate, collect, rulaunch
    with prefix('source %s/bin/activate' % virtualenv):
        run('python %s/manage.py migrate' % project_path)
        run('python %s/manage.py collectstatic --noinput' % project_path)
    run('kill -HUP `cat /tmp/%s`' % gunicorn_name)

@task
def deploy_dev():
    deploy(DEV_PATH, EXCLUDE_FILES, VIRTUALENV_DEV_PATH, DEV_GUNICORN_FILENAME)

@task
def deploy_prod():
    if confirm('Are you sure?', default=False):
        deploy(PROD_PATH, EXCLUDE_FILES, VIRTUALENV_PROD_PATH, PROD_GUNICORN_FILENAME)
