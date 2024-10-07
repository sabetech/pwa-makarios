export function getServerDateFormat(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function getUserFriendlyDateFormat(date: string): string {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-GB', {year: 'numeric', month: 'short', day: 'numeric'});
}

export function isTimeGreaterThan(time1: string, time2: string): boolean {
    const [hours1, minutes1] = time1.split(':');
    const [hours2, minutes2] = time2.split(':');

    if (Number(hours1) > Number(hours2)) {
        return true;
    } else if (Number(hours1) === Number(hours2)) {
        if (Number(minutes1) > Number(minutes2)) {
            return true;
        }
    }

    return false;
}

export function convertBlobToFile(blob: Blob, fileName: string): File {
    
    return new File([blob], fileName, {type: blob.type});
}

export function convertBase64ToFile(base64String: string, fileName: string): File {

  const [mimePart, base64Data] = base64String.split(',');

  const mime = mimePart.match(/:(.*?);/)[1];
    
  // Decode the base64 string into a binary array
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);

  // Create a Blob from the binary data
  const blob = new Blob([byteArray], { type: mime });
  return convertBlobToFile(blob, fileName);
}