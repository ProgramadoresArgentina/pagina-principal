import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// DELETE /api/articles/comments/[commentId] - Eliminar comentario (solo admin o autor)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const user = await getAuthenticatedUser(token)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 401 }
      )
    }

    const { commentId } = await params

    // Buscar el comentario
    const comment = await prisma.articleComment.findUnique({
      where: { id: commentId },
      include: {
        user: {
          include: {
            role: true
          }
        }
      }
    })

    if (!comment) {
      return NextResponse.json(
        { error: 'Comentario no encontrado' },
        { status: 404 }
      )
    }

    // Verificar si el usuario es admin o el autor del comentario
    const isAdmin = user.role?.name === 'admin'
    const isAuthor = comment.userId === user.id

    if (!isAdmin && !isAuthor) {
      return NextResponse.json(
        { error: 'No tienes permiso para eliminar este comentario' },
        { status: 403 }
      )
    }

    // Eliminar el comentario
    await prisma.articleComment.delete({
      where: { id: commentId }
    })

    return NextResponse.json({
      success: true,
      message: 'Comentario eliminado correctamente'
    })
  } catch (error) {
    console.error('Error al eliminar comentario:', error)
    return NextResponse.json(
      { error: 'Error al eliminar comentario' },
      { status: 500 }
    )
  }
}
