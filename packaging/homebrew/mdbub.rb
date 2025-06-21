# To create a Homebrew tap, you'll need to:
# 1. Create a repository named "homebrew-tap" in your GitHub account
# 2. Add this formula to that repository

class Mdbub < Formula
  desc "Terminal-first interactive mindmap CLI tool"
  homepage "https://github.com/YOUR_USERNAME/mdbubbles"
  url "https://github.com/YOUR_USERNAME/mdbubbles/archive/refs/tags/v0.1.0.tar.gz"
  sha256 "REPLACE_WITH_ACTUAL_SHA256"
  license "Apache-2.0"
  head "https://github.com/YOUR_USERNAME/mdbubbles.git", branch: "main"

  depends_on "python@3.11"

  def install
    virtualenv_install_with_resources
  end

  test do
    system "#{bin}/mdbub", "version"
  end
end
