resource "aws_vpc" "main_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "devboard-vpc"
  }
}

resource "aws_subnet" "main_subnet" {
  vpc_id            = aws_vpc.main_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "ap-southeast-2a"

  tags = {
    Name = "devboard-subnet"
  }
}

resource "aws_internet_gateway" "main_igw" {
  vpc_id = aws_vpc.main_vpc.id

  tags = {
    Name = "devboard-igw"
  }
}

resource "aws_route_table" "main_route_table" {
  vpc_id = aws_vpc.main_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main_igw.id
  }

  tags = {
    Name = "devboard-route-table"
  }
}

resource "aws_route_table_association" "subnet_assoc" {
  subnet_id      = aws_subnet.main_subnet.id
  route_table_id = aws_route_table.main_route_table.id
}

resource "aws_key_pair" "devboard_key" {
  key_name   = "devboard-key"
  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCi3VesV75XqOlymxbGNWbuj4YscA8o3dxEDxTw22wTQVQaEcMj5NY97+rOBmzNTJKW6ZmnHijIRocC6PoLUyO+59jgtBPJD2yEi74pk/OH9/Cs6zuT1wEjNYH1aYiEMfCYr9NgjuD5fmYg9rf7XpQVrUXcGLDjHW9OXQIPmArit0XVLQ6/YhGBUAJ7O+1gga+JQnDFtwXFjdW5U2JIHSzCkXxJqf7/2GWhoIb/iIokNtTb5DBybamMOyplBmgoxsSHkF+OrxxEsr/Hi/2h8kqh6A5viGoM0f3atmImNruEs03CtltRnsNR1Q5KUZaHW7MIXzJlla+lqxa60/bNqtVaGY/J2+hedv16R7e96eayDYWNZ7MwO0/OFsWTkeTVWtH6zv0RwQ1raARH+FPdzOnRyg6kJhwS3385RMk/FhKbSXAktFeQ9t95EyBkJ7IIiSLArYF1aSUEOvYyjwypo2ZcJHf0H3L1x+z37ChQe5o0VLg0xHY+CAOCOENcW+Wn/qjRkfkwFfWxtA38ZJaVbP+pz7pV5GVqOXeM5GSBLc5jT88hUsBiZoIPTFXlMFkLlT66UCDQzNlhZVLLG08QkLB21Q1AwSm3PIDwey7fWhubrn0QKvDQliKP4sepZolngGJtnvlP9MWMzY8k+JV/Dd1rJXw6CJLSkvHZXNqLY76sqQ== highh678@gmail.com"
}

resource "aws_security_group" "devboard_sg" {
  name        = "devboard-sg"
  description = "Allow SSH and HTTP"
  vpc_id      = aws_vpc.main_vpc.id

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "devboard-sg"
  }
}

resource "aws_instance" "devboard_ec2" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = "t2.micro"
  subnet_id                   = aws_subnet.main_subnet.id
  vpc_security_group_ids      = [aws_security_group.devboard_sg.id]
  key_name                    = aws_key_pair.devboard_key.key_name

  tags = {
    Name = "devboard-ec2"
  }
}


data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical 的 AWS 账户 ID

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

