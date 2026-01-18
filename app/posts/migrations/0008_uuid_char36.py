from django.db import migrations


FORWARD_SQL = """
SET FOREIGN_KEY_CHECKS = 0;

SET @fk := (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'albums_webimagealbum'
      AND COLUMN_NAME = 'cover_id' AND REFERENCED_TABLE_NAME IS NOT NULL LIMIT 1);
SET @sql := IF(@fk IS NULL, 'SELECT 1', CONCAT('ALTER TABLE albums_webimagealbum DROP FOREIGN KEY `', @fk, '`'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @fk := (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'albums_webimagealbum_images'
      AND COLUMN_NAME = 'webimagealbum_id' AND REFERENCED_TABLE_NAME IS NOT NULL LIMIT 1);
SET @sql := IF(@fk IS NULL, 'SELECT 1', CONCAT('ALTER TABLE albums_webimagealbum_images DROP FOREIGN KEY `', @fk, '`'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @fk := (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'albums_webimagealbum_images'
      AND COLUMN_NAME = 'webimage_id' AND REFERENCED_TABLE_NAME IS NOT NULL LIMIT 1);
SET @sql := IF(@fk IS NULL, 'SELECT 1', CONCAT('ALTER TABLE albums_webimagealbum_images DROP FOREIGN KEY `', @fk, '`'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @fk := (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'comments_imagecomment'
      AND COLUMN_NAME = 'image_id' AND REFERENCED_TABLE_NAME IS NOT NULL LIMIT 1);
SET @sql := IF(@fk IS NULL, 'SELECT 1', CONCAT('ALTER TABLE comments_imagecomment DROP FOREIGN KEY `', @fk, '`'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @fk := (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'comments_postcomment'
      AND COLUMN_NAME = 'post_id' AND REFERENCED_TABLE_NAME IS NOT NULL LIMIT 1);
SET @sql := IF(@fk IS NULL, 'SELECT 1', CONCAT('ALTER TABLE comments_postcomment DROP FOREIGN KEY `', @fk, '`'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @fk := (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'images_webimage_tags'
      AND COLUMN_NAME = 'webimage_id' AND REFERENCED_TABLE_NAME IS NOT NULL LIMIT 1);
SET @sql := IF(@fk IS NULL, 'SELECT 1', CONCAT('ALTER TABLE images_webimage_tags DROP FOREIGN KEY `', @fk, '`'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @fk := (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'posts_post'
      AND COLUMN_NAME = 'album_id' AND REFERENCED_TABLE_NAME IS NOT NULL LIMIT 1);
SET @sql := IF(@fk IS NULL, 'SELECT 1', CONCAT('ALTER TABLE posts_post DROP FOREIGN KEY `', @fk, '`'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @fk := (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'posts_post_tags'
      AND COLUMN_NAME = 'post_id' AND REFERENCED_TABLE_NAME IS NOT NULL LIMIT 1);
SET @sql := IF(@fk IS NULL, 'SELECT 1', CONCAT('ALTER TABLE posts_post_tags DROP FOREIGN KEY `', @fk, '`'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

ALTER TABLE albums_webimagealbum
    MODIFY COLUMN id CHAR(36) NOT NULL,
    MODIFY COLUMN cover_id CHAR(36) NULL;
ALTER TABLE albums_webimagealbum_images
    MODIFY COLUMN webimagealbum_id CHAR(36) NOT NULL,
    MODIFY COLUMN webimage_id CHAR(36) NOT NULL;
ALTER TABLE comments_imagecomment
    MODIFY COLUMN image_id CHAR(36) NOT NULL;
ALTER TABLE comments_postcomment
    MODIFY COLUMN post_id CHAR(36) NOT NULL;
ALTER TABLE images_webimage
    MODIFY COLUMN id CHAR(36) NOT NULL;
ALTER TABLE images_webimage_tags
    MODIFY COLUMN webimage_id CHAR(36) NOT NULL;
ALTER TABLE posts_post
    MODIFY COLUMN id CHAR(36) NOT NULL,
    MODIFY COLUMN album_id CHAR(36) NULL;
ALTER TABLE posts_post_tags
    MODIFY COLUMN post_id CHAR(36) NOT NULL;

UPDATE albums_webimagealbum
SET id = CASE
    WHEN id REGEXP '^[0-9a-fA-F]{32}$'
        THEN INSERT(INSERT(INSERT(INSERT(id, 9, 0, '-'), 14, 0, '-'), 19, 0, '-'), 24, 0, '-')
    ELSE id
END,
cover_id = CASE
    WHEN cover_id IS NULL THEN NULL
    WHEN cover_id REGEXP '^[0-9a-fA-F]{32}$'
        THEN INSERT(INSERT(INSERT(INSERT(cover_id, 9, 0, '-'), 14, 0, '-'), 19, 0, '-'), 24, 0, '-')
    ELSE cover_id
END;

UPDATE albums_webimagealbum_images
SET webimagealbum_id = CASE
    WHEN webimagealbum_id REGEXP '^[0-9a-fA-F]{32}$'
        THEN INSERT(INSERT(INSERT(INSERT(webimagealbum_id, 9, 0, '-'), 14, 0, '-'), 19, 0, '-'), 24, 0, '-')
    ELSE webimagealbum_id
END,
webimage_id = CASE
    WHEN webimage_id REGEXP '^[0-9a-fA-F]{32}$'
        THEN INSERT(INSERT(INSERT(INSERT(webimage_id, 9, 0, '-'), 14, 0, '-'), 19, 0, '-'), 24, 0, '-')
    ELSE webimage_id
END;

UPDATE comments_imagecomment
SET image_id = CASE
    WHEN image_id REGEXP '^[0-9a-fA-F]{32}$'
        THEN INSERT(INSERT(INSERT(INSERT(image_id, 9, 0, '-'), 14, 0, '-'), 19, 0, '-'), 24, 0, '-')
    ELSE image_id
END;

UPDATE comments_postcomment
SET post_id = CASE
    WHEN post_id REGEXP '^[0-9a-fA-F]{32}$'
        THEN INSERT(INSERT(INSERT(INSERT(post_id, 9, 0, '-'), 14, 0, '-'), 19, 0, '-'), 24, 0, '-')
    ELSE post_id
END;

UPDATE images_webimage
SET id = CASE
    WHEN id REGEXP '^[0-9a-fA-F]{32}$'
        THEN INSERT(INSERT(INSERT(INSERT(id, 9, 0, '-'), 14, 0, '-'), 19, 0, '-'), 24, 0, '-')
    ELSE id
END;

UPDATE images_webimage_tags
SET webimage_id = CASE
    WHEN webimage_id REGEXP '^[0-9a-fA-F]{32}$'
        THEN INSERT(INSERT(INSERT(INSERT(webimage_id, 9, 0, '-'), 14, 0, '-'), 19, 0, '-'), 24, 0, '-')
    ELSE webimage_id
END;

UPDATE posts_post
SET id = CASE
    WHEN id REGEXP '^[0-9a-fA-F]{32}$'
        THEN INSERT(INSERT(INSERT(INSERT(id, 9, 0, '-'), 14, 0, '-'), 19, 0, '-'), 24, 0, '-')
    ELSE id
END,
album_id = CASE
    WHEN album_id IS NULL THEN NULL
    WHEN album_id REGEXP '^[0-9a-fA-F]{32}$'
        THEN INSERT(INSERT(INSERT(INSERT(album_id, 9, 0, '-'), 14, 0, '-'), 19, 0, '-'), 24, 0, '-')
    ELSE album_id
END;

UPDATE posts_post_tags
SET post_id = CASE
    WHEN post_id REGEXP '^[0-9a-fA-F]{32}$'
        THEN INSERT(INSERT(INSERT(INSERT(post_id, 9, 0, '-'), 14, 0, '-'), 19, 0, '-'), 24, 0, '-')
    ELSE post_id
END;

ALTER TABLE albums_webimagealbum
    ADD CONSTRAINT fk_albums_cover
        FOREIGN KEY (cover_id) REFERENCES images_webimage (id);
ALTER TABLE albums_webimagealbum_images
    ADD CONSTRAINT fk_album_images_album
        FOREIGN KEY (webimagealbum_id) REFERENCES albums_webimagealbum (id),
    ADD CONSTRAINT fk_album_images_image
        FOREIGN KEY (webimage_id) REFERENCES images_webimage (id);
ALTER TABLE comments_imagecomment
    ADD CONSTRAINT fk_comments_image
        FOREIGN KEY (image_id) REFERENCES images_webimage (id);
ALTER TABLE comments_postcomment
    ADD CONSTRAINT fk_comments_post
        FOREIGN KEY (post_id) REFERENCES posts_post (id);
ALTER TABLE images_webimage_tags
    ADD CONSTRAINT fk_images_tags_image
        FOREIGN KEY (webimage_id) REFERENCES images_webimage (id);
ALTER TABLE posts_post
    ADD CONSTRAINT fk_posts_album
        FOREIGN KEY (album_id) REFERENCES albums_webimagealbum (id);
ALTER TABLE posts_post_tags
    ADD CONSTRAINT fk_posts_tags_post
        FOREIGN KEY (post_id) REFERENCES posts_post (id);

SET FOREIGN_KEY_CHECKS = 1;
"""


REVERSE_SQL = """
SET FOREIGN_KEY_CHECKS = 0;

SET @fk := (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'albums_webimagealbum'
      AND COLUMN_NAME = 'cover_id' AND REFERENCED_TABLE_NAME IS NOT NULL LIMIT 1);
SET @sql := IF(@fk IS NULL, 'SELECT 1', CONCAT('ALTER TABLE albums_webimagealbum DROP FOREIGN KEY `', @fk, '`'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @fk := (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'albums_webimagealbum_images'
      AND COLUMN_NAME = 'webimagealbum_id' AND REFERENCED_TABLE_NAME IS NOT NULL LIMIT 1);
SET @sql := IF(@fk IS NULL, 'SELECT 1', CONCAT('ALTER TABLE albums_webimagealbum_images DROP FOREIGN KEY `', @fk, '`'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @fk := (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'albums_webimagealbum_images'
      AND COLUMN_NAME = 'webimage_id' AND REFERENCED_TABLE_NAME IS NOT NULL LIMIT 1);
SET @sql := IF(@fk IS NULL, 'SELECT 1', CONCAT('ALTER TABLE albums_webimagealbum_images DROP FOREIGN KEY `', @fk, '`'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @fk := (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'comments_imagecomment'
      AND COLUMN_NAME = 'image_id' AND REFERENCED_TABLE_NAME IS NOT NULL LIMIT 1);
SET @sql := IF(@fk IS NULL, 'SELECT 1', CONCAT('ALTER TABLE comments_imagecomment DROP FOREIGN KEY `', @fk, '`'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @fk := (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'comments_postcomment'
      AND COLUMN_NAME = 'post_id' AND REFERENCED_TABLE_NAME IS NOT NULL LIMIT 1);
SET @sql := IF(@fk IS NULL, 'SELECT 1', CONCAT('ALTER TABLE comments_postcomment DROP FOREIGN KEY `', @fk, '`'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @fk := (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'images_webimage_tags'
      AND COLUMN_NAME = 'webimage_id' AND REFERENCED_TABLE_NAME IS NOT NULL LIMIT 1);
SET @sql := IF(@fk IS NULL, 'SELECT 1', CONCAT('ALTER TABLE images_webimage_tags DROP FOREIGN KEY `', @fk, '`'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @fk := (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'posts_post'
      AND COLUMN_NAME = 'album_id' AND REFERENCED_TABLE_NAME IS NOT NULL LIMIT 1);
SET @sql := IF(@fk IS NULL, 'SELECT 1', CONCAT('ALTER TABLE posts_post DROP FOREIGN KEY `', @fk, '`'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @fk := (SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'posts_post_tags'
      AND COLUMN_NAME = 'post_id' AND REFERENCED_TABLE_NAME IS NOT NULL LIMIT 1);
SET @sql := IF(@fk IS NULL, 'SELECT 1', CONCAT('ALTER TABLE posts_post_tags DROP FOREIGN KEY `', @fk, '`'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE albums_webimagealbum
SET id = CASE
    WHEN id REGEXP '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
        THEN REPLACE(id, '-', '')
    ELSE id
END,
cover_id = CASE
    WHEN cover_id IS NULL THEN NULL
    WHEN cover_id REGEXP '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
        THEN REPLACE(cover_id, '-', '')
    ELSE cover_id
END;

UPDATE albums_webimagealbum_images
SET webimagealbum_id = CASE
    WHEN webimagealbum_id REGEXP '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
        THEN REPLACE(webimagealbum_id, '-', '')
    ELSE webimagealbum_id
END,
webimage_id = CASE
    WHEN webimage_id REGEXP '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
        THEN REPLACE(webimage_id, '-', '')
    ELSE webimage_id
END;

UPDATE comments_imagecomment
SET image_id = CASE
    WHEN image_id REGEXP '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
        THEN REPLACE(image_id, '-', '')
    ELSE image_id
END;

UPDATE comments_postcomment
SET post_id = CASE
    WHEN post_id REGEXP '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
        THEN REPLACE(post_id, '-', '')
    ELSE post_id
END;

UPDATE images_webimage
SET id = CASE
    WHEN id REGEXP '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
        THEN REPLACE(id, '-', '')
    ELSE id
END;

UPDATE images_webimage_tags
SET webimage_id = CASE
    WHEN webimage_id REGEXP '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
        THEN REPLACE(webimage_id, '-', '')
    ELSE webimage_id
END;

UPDATE posts_post
SET id = CASE
    WHEN id REGEXP '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
        THEN REPLACE(id, '-', '')
    ELSE id
END,
album_id = CASE
    WHEN album_id IS NULL THEN NULL
    WHEN album_id REGEXP '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
        THEN REPLACE(album_id, '-', '')
    ELSE album_id
END;

UPDATE posts_post_tags
SET post_id = CASE
    WHEN post_id REGEXP '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
        THEN REPLACE(post_id, '-', '')
    ELSE post_id
END;

ALTER TABLE albums_webimagealbum
    MODIFY COLUMN id CHAR(32) NOT NULL,
    MODIFY COLUMN cover_id CHAR(32) NULL;
ALTER TABLE albums_webimagealbum_images
    MODIFY COLUMN webimagealbum_id CHAR(32) NOT NULL,
    MODIFY COLUMN webimage_id CHAR(32) NOT NULL;
ALTER TABLE comments_imagecomment
    MODIFY COLUMN image_id CHAR(32) NOT NULL;
ALTER TABLE comments_postcomment
    MODIFY COLUMN post_id CHAR(32) NOT NULL;
ALTER TABLE images_webimage
    MODIFY COLUMN id CHAR(32) NOT NULL;
ALTER TABLE images_webimage_tags
    MODIFY COLUMN webimage_id CHAR(32) NOT NULL;
ALTER TABLE posts_post
    MODIFY COLUMN id CHAR(32) NOT NULL,
    MODIFY COLUMN album_id CHAR(32) NULL;
ALTER TABLE posts_post_tags
    MODIFY COLUMN post_id CHAR(32) NOT NULL;

ALTER TABLE albums_webimagealbum
    ADD CONSTRAINT fk_albums_cover
        FOREIGN KEY (cover_id) REFERENCES images_webimage (id);
ALTER TABLE albums_webimagealbum_images
    ADD CONSTRAINT fk_album_images_album
        FOREIGN KEY (webimagealbum_id) REFERENCES albums_webimagealbum (id),
    ADD CONSTRAINT fk_album_images_image
        FOREIGN KEY (webimage_id) REFERENCES images_webimage (id);
ALTER TABLE comments_imagecomment
    ADD CONSTRAINT fk_comments_image
        FOREIGN KEY (image_id) REFERENCES images_webimage (id);
ALTER TABLE comments_postcomment
    ADD CONSTRAINT fk_comments_post
        FOREIGN KEY (post_id) REFERENCES posts_post (id);
ALTER TABLE images_webimage_tags
    ADD CONSTRAINT fk_images_tags_image
        FOREIGN KEY (webimage_id) REFERENCES images_webimage (id);
ALTER TABLE posts_post
    ADD CONSTRAINT fk_posts_album
        FOREIGN KEY (album_id) REFERENCES albums_webimagealbum (id);
ALTER TABLE posts_post_tags
    ADD CONSTRAINT fk_posts_tags_post
        FOREIGN KEY (post_id) REFERENCES posts_post (id);

SET FOREIGN_KEY_CHECKS = 1;
"""


class Migration(migrations.Migration):
    dependencies = [
        ("albums", "0001_initial"),
        ("comments", "0001_initial"),
        ("images", "0001_initial"),
        ("posts", "0007_alter_post_category"),
    ]

    operations = [
        migrations.RunSQL(FORWARD_SQL, REVERSE_SQL),
    ]
