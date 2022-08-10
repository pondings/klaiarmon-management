export const inputFileToBlob = (file: File): Promise<string> => new Promise(async (resolve, reject) => {
    if (!file) return reject('Input file is empty!');
    const fileReader = new FileReader();

    fileReader.readAsArrayBuffer(file);
    fileReader.onload = () => {
        const blob = new Blob([fileReader.result!]);
        return resolve(URL.createObjectURL(blob));
    };
});
