import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Chip,
  Divider,
} from '@mui/material'
import {
  Person,
  Email,
  Phone,
  Link as LinkIcon,
} from '@mui/icons-material'
import { UserInfoResponse } from '../../api/types'

interface UserProfileCardProps {
  user: UserInfoResponse
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar
            src={user.profile_url}
            sx={{ width: 64, height: 64, mr: 2, bgcolor: 'primary.main' }}
          >
            <Person />
          </Avatar>
          <Box>
            <Typography variant="h6" gutterBottom>
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {user.id}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex" alignItems="center">
            <Email sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body2">
              {user.email}
            </Typography>
          </Box>

          {user.phone && (
            <Box display="flex" alignItems="center">
              <Phone sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2">
                {user.phone}
              </Typography>
            </Box>
          )}

          {user.phones && user.phones.length > 0 && (
            <Box display="flex" flexWrap="wrap" gap={0.5} mt={1}>
              {user.phones.map((phone, index) => (
                <Chip
                  key={index}
                  label={phone}
                  size="small"
                  variant="outlined"
                  icon={<Phone />}
                />
              ))}
            </Box>
          )}

          {user.profile_url && (
            <Box display="flex" alignItems="center" mt={1}>
              <LinkIcon sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />
              <Typography
                variant="body2"
                sx={{
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  '&:hover': { color: 'primary.main' },
                }}
                onClick={() => window.open(user.profile_url, '_blank')}
              >
                Профиль Avito
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default UserProfileCard