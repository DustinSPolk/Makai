USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[Messages_Update]    Script Date: 5/10/2023 12:05:37 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Dustin Polk
-- Create date: 03-14-2023
-- Description: Update Messages by Id
-- Code Reviewer:

-- MODIFIED BY:
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

ALTER proc [dbo].[Messages_Update]
	      @Message nvarchar(1000)
	      ,@Subject nvarchar(100)
        ,@RecipientId int
        ,@SenderId int
        ,@DateSent datetime2(7)
        ,@DateRead datetime2(7)
	      ,@Id int

as

/* --- TEST ---

	DECLARE @Id int = 2

	DECLARE @Message nvarchar(1000) = 'Update message'
			    ,@Subject nvarchar(100) = 'Update subject'
			    ,@RecipientId int = 1
			    ,@SenderId int = 2
			    ,@DateSent datetime2(7) = '2023-09-12'
			    ,@DateRead datetime2(7) = '2023-09-13'

	EXECUTE [dbo].[Messages_Update]
			    @Message
			    ,@Subject
			    ,@RecipientId
			    ,@SenderId
			    ,@DateSent
			    ,@DateRead
			    ,@Id

	SELECT *
	FROM [dbo].[Messages]
	WHERE Id = @Id


*/

BEGIN
	
	DECLARE @dateNow datetime2 = GETUTCDATE();

	UPDATE [dbo].[Messages]

  SET Message = @Message
		  ,Subject = @Subject
		  ,RecipientId = @RecipientId
		  ,SenderId = @SenderId
		  ,DateSent = @DateSent
		  ,DateRead = @DateRead
		  ,DateModified = @dateNow

	WHERE Id = @Id

END
