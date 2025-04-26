function formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    };

    return new Intl.DateTimeFormat('pt-BR', options).format(date);
}

export { formatDate }