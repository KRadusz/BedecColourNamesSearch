import requests

# Define the GitHub token and the file path
github_token = 'XXX'

file_path = 'XXX'

gist_description = "My uploaded Gist in 3 parts"
gist_filename_template = 'compressed_output_part_{}.js'

# Read the content of the file
with open(file_path, 'r') as file:
    content = file.read()

# Function to create a Gist
def create_gist(filename, content, description, token):
    payload = {
        "description": description,
        "public": True,
        "files": {
            filename: {
                "content": content
            }
        }
    }
    headers = {
        "Authorization": f"token {token}"
    }
    response = requests.post('https://api.github.com/gists', json=payload, headers=headers)
    if response.status_code == 201:
        return response.json()['html_url']
    else:
        print(f"Failed to create Gist: {response.status_code}")
        print(response.json())
        return None

# Split the content into 3 parts
part_size = len(content) // 3
parts = [content[i:i + part_size] for i in range(0, len(content), part_size)]

# Ensure we have exactly 3 parts by combining the last part if necessary
if len(parts) > 3:
    parts[2] += ''.join(parts[3:])
    parts = parts[:3]

# Upload each part as a separate Gist
gist_urls = []
for i, part in enumerate(parts):
    filename = gist_filename_template.format(i + 1)
    url = create_gist(filename, part, gist_description, github_token)
    if url:
        gist_urls.append(url)

# Print the URLs of the created Gists
print("Gists created successfully:")
for url in gist_urls:
    print(url)