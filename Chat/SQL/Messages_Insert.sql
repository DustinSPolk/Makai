USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[Messages_Insert]    Script Date: 5/10/2023 11:56:29 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Dustin Polk
-- Create date: 03-14-2023
-- Description: Insert Messages
-- Code Reviewer:

-- MODIFIED BY:
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

ALTER proc [dbo].[Messages_Insert]
	@Message nvarchar(1000)
	,@Subject nvarchar(100)
  ,@RecipientId int
  ,@SenderId int
  ,@DateSent datetime2(7)
  ,@DateRead datetime2(7)
	,@Id int OUTPUT

as

/* --- TEST ---

	DECLARE @Message nvarchar(1000) = 'Test message'
			,@Subject nvarchar(100) = 'Test subject'
			,@RecipientId int = 1
			,@SenderId int = 2
			,@DateSent datetime2(7) = '2023-09-10'
			,@DateRead datetime2(7) = '2023-09-11'
			,@Id int

	EXECUTE [dbo].[Messages_Insert]
			@Message
			,@Subject
			,@RecipientId
			,@SenderId
			,@DateSent
			,@DateRead
			,@Id OUTPUT

	SELECT *
	FROM [dbo].[Messages]
	WHERE Id = @Id


*/

BEGIN

	INSERT INTO [dbo].[Messages]
			   ([Message]
			   ,[Subject]
			   ,[RecipientId]
			   ,[SenderId]
			   ,[DateSent]
			   ,[DateRead])
         
     VALUES
           (@Message
           ,@Subject
           ,@RecipientId
           ,@SenderId
           ,@DateSent
           ,@DateRead)

	SET @Id = SCOPE_IDENTITY()

END
