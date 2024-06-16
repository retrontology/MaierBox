# forms.py
from django import forms
from .models import Image, Tag, Category


class ImageForm(forms.ModelForm):
    class Meta:
        model = Image
        fields = ['image', 'category', 'tags',]

class TagForm(forms.ModelForm):
    class Meta:
        model = Tag
        fields = ['name']

class CategoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ['name']
