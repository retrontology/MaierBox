# MaierBox
### Description
MaierBox is a website application based on the Django framework and containerized with Docker. It's designed to be a photography blog for a single person. In its current state, it is only designed to be used as my personal website: https://www.retrontology.com

### Features
- Blog posting
  - Custom JS form containing SimplMDE for posting
  - Allows for uploading/attaching images to posts
  - Paginated post index sorted by newest to oldest
- High quality image storage and viewing
  - Automatic watermarking
  - Generate both a scaled and thumbnail image
  - Categorize images with a one-to-many relationship
  - Tag images with a many-to-many relationship
  - Custom JS image upload form for multiple images that includes classifiers
- A link to my Github ( ͡° ͜ʖ ͡°)

### Testing
MaierBox can be tested locally by using the Docker Compose plugin:
```
docker compose up
```
Please note that the current application is designed to run on the arm64 platform. Please ensure you have the necessary requirements for emulation within Docker if you are going to test on an amd64 platform.

### Deployment
MaierBox is currently being deployed to AWS CloudFormation using the templates found in [MaierBox-cf](https://github.com/retrontology/MaierBox-cf)
