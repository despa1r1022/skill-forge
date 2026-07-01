use thiserror::Error;

#[derive(Debug, Error)]
pub enum ValidationError {
    #[error("name is required and must be non-empty")]
    NameRequired,
    #[error("description is required and must be non-empty")]
    DescriptionRequired,
    #[error("invalid version format: {0}")]
    InvalidVersion(String),
    #[error("name contains invalid characters: {0}")]
    InvalidName(String),
}

pub fn validate_name(name: &str) -> Result<(), ValidationError> {
    if name.trim().is_empty() {
        return Err(ValidationError::NameRequired);
    }
    if name.contains('/') || name.contains('\\') {
        return Err(ValidationError::InvalidName(name.to_string()));
    }
    Ok(())
}

pub fn validate_description(desc: &str) -> Result<(), ValidationError> {
    if desc.trim().is_empty() {
        return Err(ValidationError::DescriptionRequired);
    }
    Ok(())
}

pub fn validate_version(version: &str) -> Result<(), ValidationError> {
    let parts: Vec<&str> = version.split('.').collect();
    if parts.len() < 2 || parts.len() > 3 {
        return Err(ValidationError::InvalidVersion(version.to_string()));
    }
    for part in &parts {
        if part.parse::<u32>().is_err() {
            return Err(ValidationError::InvalidVersion(version.to_string()));
        }
    }
    Ok(())
}
