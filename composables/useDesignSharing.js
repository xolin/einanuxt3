import { ref } from 'vue'

export const useDesignSharing = () => {
  const isSharing = ref(false)
  const shareError = ref(null)

  // Generate shareable link
  const generateShareableLink = (designData) => {
    try {
      const encodedData = encodeURIComponent(btoa(JSON.stringify(designData)))
      const baseUrl = window.location.origin
      return `${baseUrl}/editor?shared=${encodedData}`
    } catch (err) {
      console.error('Error generating shareable link:', err)
      shareError.value = 'Failed to generate shareable link'
      return null
    }
  }

  // Copy link to clipboard
  const copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
        return true
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        
        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        
        return successful
      }
    } catch (err) {
      console.error('Error copying to clipboard:', err)
      shareError.value = 'Failed to copy to clipboard'
      return false
    }
  }

  // Share via Web Share API (mobile)
  const shareNative = async (shareData) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: shareData.title || 'My Custom Skateboard Design',
          text: shareData.text || 'Check out my awesome skateboard design!',
          url: shareData.url
        })
        return true
      }
      return false
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing natively:', err)
        shareError.value = 'Failed to share'
      }
      return false
    }
  }

  // Social media sharing URLs
  const getSocialShareUrl = (platform, designData) => {
    const shareUrl = generateShareableLink(designData)
    const title = `Check out my custom skateboard design: ${designData.name}`
    const hashtags = 'skateboard,customdesign,einanuxt3'

    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}&hashtags=${hashtags}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${shareUrl}`)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(title)}`
    }

    return urls[platform] || null
  }

  // Open social share in new window
  const openSocialShare = (platform, designData) => {
    const url = getSocialShareUrl(platform, designData)
    if (url) {
      window.open(url, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes')
    }
  }

  // Download design as image for sharing
  const downloadForSharing = (canvas, designName) => {
    try {
      // Create download link
      const link = document.createElement('a')
      link.download = `${designName || 'skateboard-design'}.png`
      link.href = canvas.toDataURL('image/png', 1.0)
      
      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      return true
    } catch (err) {
      console.error('Error downloading design:', err)
      shareError.value = 'Failed to download design'
      return false
    }
  }

  // Parse shared design from URL
  const parseSharedDesign = (sharedParam) => {
    try {
      if (!sharedParam) return null
      
      const decodedData = atob(decodeURIComponent(sharedParam))
      const designData = JSON.parse(decodedData)
      
      // Validate design data structure
      if (designData.app === 'einanuxt3' && designData.design) {
        return designData.design
      }
      
      return null
    } catch (err) {
      console.error('Error parsing shared design:', err)
      shareError.value = 'Invalid shared design link'
      return null
    }
  }

  // Email sharing
  const shareViaEmail = (designData) => {
    const shareUrl = generateShareableLink(designData)
    const subject = encodeURIComponent(`Check out my custom skateboard design: ${designData.name}`)
    const body = encodeURIComponent(`Hi! I created this awesome skateboard design and wanted to share it with you.

Design Name: ${designData.name}
Created: ${new Date(designData.createdAt).toLocaleDateString()}

View the design here: ${shareUrl}

Created with Custom Decks - Design your perfect skateboard!`)

    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`
    window.location.href = mailtoUrl
  }

  // Check if sharing is supported
  const canShareNatively = () => {
    return 'share' in navigator
  }

  // Check if clipboard is supported
  const canCopyToClipboard = () => {
    return 'clipboard' in navigator || document.queryCommandSupported('copy')
  }

  // Clear share error
  const clearError = () => {
    shareError.value = null
  }

  // Generate QR code data URL (simple implementation)
  const generateQRCode = (text) => {
    // For a full implementation, you'd use a QR code library
    // This is a placeholder that returns a data URL for a simple QR-like pattern
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = 200
      canvas.height = 200
      
      // Simple placeholder pattern - in real implementation use QR library
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, 200, 200)
      ctx.fillStyle = '#fff'
      ctx.fillRect(10, 10, 180, 180)
      ctx.fillStyle = '#000'
      ctx.font = '12px Arial'
      ctx.fillText('QR Code', 80, 100)
      ctx.fillText('(Use library)', 70, 120)
      
      return canvas.toDataURL()
    } catch (err) {
      console.error('Error generating QR code:', err)
      return null
    }
  }

  return {
    // State
    isSharing,
    shareError,

    // Methods
    generateShareableLink,
    copyToClipboard,
    shareNative,
    getSocialShareUrl,
    openSocialShare,
    downloadForSharing,
    parseSharedDesign,
    shareViaEmail,
    generateQRCode,
    
    // Utils
    canShareNatively,
    canCopyToClipboard,
    clearError
  }
}