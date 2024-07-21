# MaierBox
### Description
MaierBox is a website application based on the Django framework and containerized with Docker. It's designed to be a photography blog for a single person. In its current state, it is only designed to be used as my personal website: https://www.retrontology.com

### Features
- Blog posts with a markdown editor
- High quality image storage and viewing
  - Automatic watermarking
  - Generate both a scaled and thumbnail image
  - Categorize images with a one-to-many relationship
  - Tag images with a many-to-many relationship

### Deployment
MaierBox is currently being deployed to AWS CloudFormation using the templates found in [MaierBox-cf](https://github.com/retrontology/MaierBox-cf)
