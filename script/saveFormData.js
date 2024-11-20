async function saveFormData(formData) {
    try {
        const response = await fetch('/saveFormData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to save form data');
        }
        
        return true;
    } catch (error) {
        console.error('Error saving form data:', error);
        return false;
    }
}
