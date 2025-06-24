# Submitting to Homebrew Core

To get your package into the official Homebrew repository so users can install with just `brew install mdbub`, follow these steps:

## Prerequisites

Before submitting to Homebrew Core, your software should:

1. **Be stable and popular**: Have some user base and stability
2. **Be notable**: Not just a simple script, but a substantial tool
3. **Be maintained**: Active development and maintenance
4. **Meet requirements**: Follow [Homebrew's acceptable formulae guidelines](https://docs.brew.sh/Acceptable-Formulae)

## Requirements Checklist

- [ ] **Open source** with an OSI-approved license
- [ ] **Stable**: Not pre-release or development versions
- [ ] **Notable**: Has a reasonable user base or fills a clear need
- [ ] **Not already in Homebrew**: Check with `brew search mdbub`
- [ ] **Not a duplicate**: Doesn't duplicate functionality of existing formulae
- [ ] **Builds from source**: Can be compiled/installed from source code
- [ ] **Version tagged**: Uses semantic versioning with git tags

## Steps to Submit

### 1. Test Your Formula Locally

First, make sure your formula works correctly:

```bash
# Create a local formula (based on our template)
brew create https://github.com/YOUR_USERNAME/mdbubbles/archive/refs/tags/v1.0.0.tar.gz

# Edit the generated formula
brew edit mdbub

# Test the formula
brew install --build-from-source mdbub
brew test mdbub
brew audit --strict mdbub
```

### 2. Create the Official Formula

Create a proper formula file for Homebrew Core:

```ruby
class Mdbub < Formula
  desc "Terminal-first interactive mindmap CLI tool"
  homepage "https://github.com/YOUR_USERNAME/mdbubbles"
  url "https://github.com/YOUR_USERNAME/mdbubbles/archive/refs/tags/v1.0.0.tar.gz"
  sha256 "YOUR_CALCULATED_SHA256"
  license "Apache-2.0"
  head "https://github.com/YOUR_USERNAME/mdbubbles.git", branch: "main"

  depends_on "python@3.11"

  resource "click" do
    url "https://files.pythonhosted.org/packages/click-8.1.0.tar.gz"
    sha256 "CLICK_SHA256"
  end

  # Add other Python dependencies as resources

  def install
    virtualenv_install_with_resources
  end

  test do
    assert_match "mdbub version", shell_output("#{bin}/mdbub version")
  end
end
```

### 3. Fork and Submit

1. **Fork** the [homebrew-core repository](https://github.com/Homebrew/homebrew-core)

2. **Create a new branch**:
   ```bash
   git checkout -b mdbub
   ```

3. **Add your formula**:
   ```bash
   # Copy your formula to Formula/mdbub.rb
   cp your-formula.rb Formula/mdbub.rb
   ```

4. **Test thoroughly**:
   ```bash
   brew install --build-from-source ./Formula/mdbub.rb
   brew test ./Formula/mdbub.rb
   brew audit --strict ./Formula/mdbub.rb
   ```

5. **Create a pull request** to homebrew-core with:
   - Clear title: "mdbub 1.0.0 (new formula)"
   - Description explaining what the tool does
   - Link to your project's homepage
   - Mention any notable features or use cases

### 4. Formula Template for Homebrew Core

Here's a more complete template for the official submission:

```ruby
class Mdbub < Formula
  include Language::Python::Virtualenv

  desc "Terminal-first interactive mindmap CLI tool"
  homepage "https://github.com/YOUR_USERNAME/mdbubbles"
  url "https://github.com/YOUR_USERNAME/mdbubbles/archive/refs/tags/v1.0.0.tar.gz"
  sha256 "SHA256_OF_THE_TARBALL"
  license "Apache-2.0"
  head "https://github.com/YOUR_USERNAME/mdbubbles.git", branch: "main"

  depends_on "python@3.11"

  def install
    virtualenv_install_with_resources
  end

  test do
    # Test that the binary works
    assert_match version.to_s, shell_output("#{bin}/mdbub version")

    # Test basic functionality
    (testpath/"test.md").write("+ Test mindmap\n  > Sub item")
    assert_match "Test mindmap", shell_output("#{bin}/mdbub view #{testpath}/test.md")
  end
end
```

## Review Process

1. **Automated checks**: Homebrew's CI will run tests
2. **Maintainer review**: Homebrew maintainers will review your formula
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, your formula will be merged

## Tips for Success

1. **Follow naming conventions**: Use lowercase with hyphens
2. **Write good tests**: Test core functionality, not just version
3. **Use stable URLs**: Point to tagged releases, not branches
4. **Keep it simple**: Don't over-complicate the formula
5. **Be responsive**: Address feedback quickly and politely

## Alternative: Start with a Tap

If Homebrew Core seems daunting or your tool isn't ready yet:

1. **Start with your personal tap** (already set up)
2. **Build a user base** and gather feedback
3. **Improve stability** and add features
4. **Submit to Core** once established

Users can initially install with:
```bash
brew tap YOUR_USERNAME/tap
brew install mdbub
```

Then later, once in Homebrew Core:
```bash
brew untap YOUR_USERNAME/tap  # Remove the tap
brew install mdbub            # Install from core
```

## Timeline

- **Personal tap**: Available immediately after setup
- **Homebrew Core**: Can take weeks/months depending on review queue and feedback

The personal tap is perfect for getting started and building your user base!
