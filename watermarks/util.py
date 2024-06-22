from matplotlib import font_manager

def findFonts():
    systemt_fonts = font_manager.findSystemFonts(fontext='ttf')
    fonts = []
    for font in systemt_fonts:
        try:
            font_obj = font_manager.get_font(font)
            fonts.append(
                {
                    'name': f'{font_obj.family_name} {font_obj.style_name}',
                    'family': font_obj.family_name,
                    'path': font_obj.fname,
                    'style': font_obj.style_name
                }
            )
        except Exception as e:
            print(f'Ran into the following exception trying to load the font from {font}: {e}')
    return fonts
