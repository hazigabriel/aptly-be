export type ResumeParsedData = {
    personalInfo: {
        name: string | null
        email: string | null
        phone: string | null
        address: string | null
        linkedin: string | null
        github: string | null
        website: string | null
    } | null
    about: string | null
    experience: Array<{
        jobTitle: string | null
        company: string | null
        location: string | null
        dateRange: string | null
        description: string | null
    }> | null
    education: Array<{
        degree: string | null
        fieldOfStudy: string | null
        institution: string | null
        location: string | null
        dateRange: string | null
    }> | null
    skills: (string | null)[] | null
    certifications: Array<{
        name: string | null
        issuingOrganization: string | null
        issueDate: string | null
        expirationDate: string | null
    }> | null
    projects: Array<{
        title: string | null
        description: string | null
        link: string | null
        technologies: (string | null)[] | null
    }> | null
    languages: Array<{
        name: string | null
        proficiency: string | null
    }> | null
    interests: (string | null)[] | null
}
