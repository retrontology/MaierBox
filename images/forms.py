# forms.py
from django import forms
from .models import WebImage, Tag, Category

class TagForm(forms.ModelForm):
    class Meta:
        model = Tag
        fields = ['name']

class CategoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ['name']
