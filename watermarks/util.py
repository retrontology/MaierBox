from matplotlib import font_manager

def findFonts():
    systemt_fonts = font_manager.findSystemFonts(fontext='ttf')
    fonts = []
    for font in systemt_fonts:
        font = font_manager.get_font(font)
        fonts.append(
            {
                'name': f'{font.family_name} {font.style_name}',
                'family': font.family_name,
                'path': font.fname,
                'style': font.style_name
            }
        )
    return fonts
